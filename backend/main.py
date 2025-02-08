import os

from fastapi import FastAPI, File, UploadFile
from dotenv import load_dotenv

# from inference import process_text

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
    
    # RUN PROCESSING FUNCTION HERE
    # json_response = process_text(file.file.read())
    file_content = await file.read()
    json_response = [
        {"content": file_content.decode("utf-8"), "audio_path": f"{storage_path}/audio.wav"},
    ]

    
    return {"message": f"File '{file.filename}' uploaded successfully to {storage_path}", "data": json_response}