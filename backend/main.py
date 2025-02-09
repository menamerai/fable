import os
import asyncio
import json
from fastapi import FastAPI, File, UploadFile, WebSocket
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from asyncio import Queue
from contextlib import asynccontextmanager
import sys
from pathlib import Path
from shared import gesture_queue  # Update import
from src.chunk import chunk_text
from src.model import MAGNeT_inference
from src.llm import gemini_generate_ambience, gemini_generate_music_prompt, gemini_dyslexia_fix

# Add gestures.py to the Python path if it's in the same directory
sys.path.append(str(Path(__file__).parent))
from gestures import run_gesture_detection
import re

# from inference import process_text

load_dotenv()

storage_path = os.getenv("STORAGE_FOLDER")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start gesture detection in a background task
    gesture_task = asyncio.create_task(run_gesture_detection(gesture_queue))
    yield
    # Cancel the gesture detection task when shutting down
    gesture_task.cancel()
    try:
        await gesture_task
    except asyncio.CancelledError:
        pass


app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL from .env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/upload")
async def upload(file: UploadFile = File(...)):
    if file.content_type != "text/plain":
        return {"error": "Only .txt files are allowed"}

    file_content = await file.read()

    # Ensure the storage path exists
    os.makedirs(storage_path, exist_ok=True)

    # Define the path to save the file
    file_path = os.path.join(storage_path, "books", file.filename)

    # Ensure the books directory exists
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    # Write the file content to the specified path
    with open(file_path, "wb") as f:
        f.write(file_content)

    # Call chunk_text to process the file
    json_response = chunk_text(Path(file_path))

    # generate music prompt
    prompts = gemini_generate_music_prompt(json_response)

    # Kick off MAGNeT_inference as a background task
    asyncio.create_task(MAGNeT_inference(json_response, prompts))

    # kick off ambience generation as a background task
    asyncio.create_task(gemini_generate_ambience(file_path, json_response))

    return {
        "message": f"File '{file.filename}' uploaded successfully to {storage_path}",
        "data": {"id": file.filename},
    }


@app.get("/audio/{filename}")
async def get_audio(filename: str):
    file_path = os.path.join(storage_path, "music", filename)
    print(file_path)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"error": "File not found"}


@app.get("/ambient_audio/{filename}")
async def get_ambient_audio(filename: str):
    file_path = os.path.join(storage_path, "ambience", filename)
    print(file_path)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"error": "File not found"}


@app.get("/audio_status/{filename}")
async def get_audio_status(filename: str):
    # List all files in the music directory
    music_files = os.listdir(os.path.join(storage_path, "music"))

    # Use regex to find files that match the filename pattern
    pattern = re.compile(rf"^{re.escape(filename)}.*\.wav$")
    matching_files = [f for f in music_files if pattern.match(f)]

    if matching_files:
        return {"status": "ready", "files": matching_files}
    return {"status": "processing"}


@app.get("/ambient_audio_status/{filename}")
async def get_ambient_audio_status(filename: str):
    file_path = os.path.join(storage_path, "selection", filename)
    if os.path.exists(file_path):
        return {"status": "ready"}
    return {"status": "processing"}


@app.get("/selection/{filename}")
async def get_selection(filename: str):
    file_path = os.path.join(storage_path, "selection", filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return {"error": "File not found"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Wait for messages from the gesture queue
            try:
                message = await asyncio.wait_for(gesture_queue.get(), timeout=1.0)
                print(f"Received message from CV2: {message}")
                await websocket.send_text(message)
            except asyncio.TimeoutError:
                # No message received, continue waiting
                continue
            except Exception as e:
                print(f"Error sending message: {e}")
                break
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()


@app.post("/dyslexia")
async def streaming(content: str):
    async def generate_text(content: str):
        # lorem_words = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split()

        # for word in lorem_words:
        #     await asyncio.sleep(0.1)  # 100ms delay
        #     yield json.dumps({"choices": [{"delta": {"content": word + " "}}]}) + "\n"

        # Call dyslexia fix function
        for chunk in gemini_dyslexia_fix(content):
            for word in chunk:
                await asyncio.sleep(0.1)
                yield json.dumps({"choices": [{"delta": {"content": word + " "}}]}) + "\n"

    return StreamingResponse(generate_text(content), media_type="application/json")
