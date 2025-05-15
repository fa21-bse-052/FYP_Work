# trainer_manager.py
from longtrainer.trainer import LongTrainer
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from config import CONNECTION_STRING, CHATGROQ_API_KEY, CUSTOM_PROMPT

def get_embeddings():
    # Initialize HuggingFace embeddings with the specified model and parameters
    model_name = "BAAI/bge-small-en"
    model_kwargs = {"device": "cpu"}
    encode_kwargs = {"normalize_embeddings": True}
    embeddings = HuggingFaceEmbeddings(
        model_name=model_name, model_kwargs=model_kwargs, encode_kwargs=encode_kwargs
    )
    return embeddings

def get_llm():
    if not CHATGROQ_API_KEY:
        raise ValueError("CHATGROQ_API_KEY is not set.")
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0,
        max_tokens=1024,
        api_key=CHATGROQ_API_KEY
    )
    return llm

embedding_model = get_embeddings()
llm = get_llm()

# Create a global LongTrainer instance
trainer_instance = LongTrainer(
    mongo_endpoint=CONNECTION_STRING,
    llm=llm,
    embedding_model=embedding_model,
    encrypt_chats=True
)

def get_trainer():
    return trainer_instance
