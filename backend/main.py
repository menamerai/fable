import os

from fastapi import FastAPI, File, UploadFile
from dotenv import load_dotenv

load_dotenv()

storage_path = os.getenv("STORAGE_FOLDER")

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    if file.content_type != "text/plain":
        return {"error": "Only .txt files are allowed"}
    
    file_location = f"./data/{file.filename}"
    with open(file_location, "wb") as f:
        f.write(file.file.read())
    
    return {"message": f"File '{file.filename}' uploaded successfully"}