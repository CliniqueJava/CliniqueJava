from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

from knowledge import medical_docs

# 📚 Convert to documents
documents = [Document(page_content=text) for text in medical_docs]

# 🧠 FREE embeddings model
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# 📦 FAISS vector DB
vectorstore = FAISS.from_documents(documents, embeddings)


def search_medical_info(query: str):

    results = vectorstore.similarity_search(query, k=3)

    return "\n".join([r.page_content for r in results])
# iyadh: FAISS + HuggingFace
