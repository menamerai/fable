import os
import sqlite3

from uuid import uuid4
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse, StreamingResponse
from dotenv import load_dotenv
import asyncio

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
        {"content": file_content.decode("utf-8"), "audio_path": f"{storage_path}/audio/sample.mp3", "title": "Sample Title", "uuid": str(uuid4())},
    ]

    # Ensure the data directory exists
    os.makedirs("./data", exist_ok=True)

    # Connect to the SQLite database
    conn = sqlite3.connect("./data/music.db")
    cursor = conn.cursor()

    # Create the table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS music (
        id TEXT PRIMARY KEY,
        content TEXT,
        audio_path TEXT,
        title TEXT
    )
    ''')

    # Insert each JSON entry as a row in the table
    for entry in json_response:
        cursor.execute('''
        INSERT INTO music (id, content, audio_path, title) VALUES (?, ?, ?, ?)
        ''', (entry["uuid"], entry["content"], entry["audio_path"], entry["title"]))

    # Commit the transaction and close the connection
    conn.commit()
    conn.close()
    
    return {"message": f"File '{file.filename}' uploaded successfully to {storage_path}", "data": json_response}

@app.get("/audio/{filename}")
async def get_audio(filename: str):
    file_path = os.path.join(storage_path, "music", filename)
    print(file_path)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"error": "File not found"}

@app.get("/status/{id}")
async def get_status(id: str):
    async def progress():
        for i in range(101):
            yield f"data: {i}\n\n"
            await asyncio.sleep(0.1)
    
    return StreamingResponse(progress(), media_type="text/event-stream")