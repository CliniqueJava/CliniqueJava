import json
import datetime
import os

from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_groq import ChatGroq
from rag_engine import search_medical_info
from doctor_service import map_to_db_specialty, get_doctors_by_specialty

load_dotenv()

app = FastAPI()

# 🤖 Groq LLM
llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)

# 📩 Request model
class PatientRequest(BaseModel):
    message: str
    user_id: str | None = "anonymous"


# 🧠 Safe JSON parser
def safe_parse_json(text: str):
    try:
        text = text.strip()
        text = text.replace("```json", "").replace("```", "")
        return json.loads(text)
    except Exception:
        return {
            "possible_conditions": [],
            "risk_level": "unknown",
            "advice": "Unable to parse AI response safely.",
            "recommended_doctor": "General Practitioner"
        }


@app.post("/medical-agent")
def medical_agent(req: PatientRequest):
    try:
        print("\n==============================")
        print("TIME:", datetime.datetime.now())
        print("USER:", req.user_id)
        print("MESSAGE:", req.message)
        print("==============================\n")

        # 🔍 RAG — retrieve relevant medical knowledge
        context = search_medical_info(req.message)

        # 🧠 Prompt — strict JSON output
        prompt = f"""
You are a medical AI assistant used in a clinic system.

RULES:
- You are NOT a real doctor
- Be medically safe and responsible
- If symptoms are serious → recommend emergency care
- Output MUST be valid JSON only, no extra text

FORMAT:
{{
  "possible_conditions": ["condition1", "condition2"],
  "risk_level": "low|medium|high",
  "advice": "Clear advice for the patient in 1-2 sentences.",
  "recommended_doctor": "exact specialty name (e.g. Cardiologist, Neurologist, Dermatologist, Pediatrician, General Practitioner)"
}}

MEDICAL KNOWLEDGE:
{context}

PATIENT MESSAGE:
{req.message}
"""

        # 🤖 LLM call
        response = llm.invoke(prompt)
        parsed = safe_parse_json(response.content.strip())

        # 🏥 Map LLM specialty → DB enum → fetch real doctors
        llm_specialty = parsed.get("recommended_doctor", "General Practitioner")
        db_specialty = map_to_db_specialty(llm_specialty)
        doctors = get_doctors_by_specialty(db_specialty)

        # 📦 Final response
        return {
            "user_id": req.user_id,
            "analysis": parsed,
            "mapped_specialty": llm_specialty,
            "db_specialty": db_specialty,
            "recommended_doctors": doctors,
            "timestamp": str(datetime.datetime.now())
        }

    except Exception as e:
        print("ERROR:", str(e))
        return {
            "error": str(e),
            "status": "failed",
            "timestamp": str(datetime.datetime.now())
        }
