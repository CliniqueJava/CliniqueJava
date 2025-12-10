import requests

SPRING_BOOT_URL = "http://localhost:8009"

# Maps the LLM specialty output to the Speciality enum used in the DB
SPECIALTY_MAP = {
    "cardiologist":        "CARDIOLOGY",
    "cardiology":          "CARDIOLOGY",
    "neurologist":         "NEUROLOGY",
    "neurology":           "NEUROLOGY",
    "dermatologist":       "DERMATOLOGY",
    "dermatology":         "DERMATOLOGY",
    "pediatrician":        "PEDIATRICS",
    "pediatrics":          "PEDIATRICS",
    "pulmonologist":       "GENERAL_MEDICINE",
    "pulmonology":         "GENERAL_MEDICINE",
    "endocrinologist":     "GENERAL_MEDICINE",
    "endocrinology":       "GENERAL_MEDICINE",
    "gastroenterologist":  "GENERAL_MEDICINE",
    "gastroenterology":    "GENERAL_MEDICINE",
    "rheumatologist":      "GENERAL_MEDICINE",
    "psychiatrist":        "GENERAL_MEDICINE",
    "psychologist":        "GENERAL_MEDICINE",
    "urologist":           "GENERAL_MEDICINE",
    "hematologist":        "GENERAL_MEDICINE",
    "ophthalmologist":     "GENERAL_MEDICINE",
    "allergist":           "GENERAL_MEDICINE",
    "ent specialist":      "GENERAL_MEDICINE",
    "general practitioner":"GENERAL_MEDICINE",
    "general surgeon":     "GENERAL_MEDICINE",
    "general":             "GENERAL_MEDICINE",
}


def map_to_db_specialty(llm_specialty: str) -> str:
    """Convert LLM specialty string to DB enum value."""
    return SPECIALTY_MAP.get(llm_specialty.lower().strip(), "GENERAL_MEDICINE")


def get_doctors_by_specialty(db_specialty: str) -> list:
    """Fetch doctors from Spring Boot by DB specialty enum."""
    try:
        response = requests.get(
            f"{SPRING_BOOT_URL}/api/doctors/search",
            params={"speciality": db_specialty},
            timeout=5
        )
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        print(f"[doctor_service] Failed to fetch doctors: {e}")
    return []

# iyadh: fetch doctors by specialty
