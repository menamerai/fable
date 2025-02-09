import getpass
import os
from typing import List
from dotenv import load_dotenv
from pathlib import Path
from langchain_experimental.text_splitter import SemanticChunker
from langchain_google_genai import GoogleGenerativeAIEmbeddings

def chunk() -> List[dict]: 
    load_dotenv()
    
    text_splitter = SemanticChunker(GoogleGenerativeAIEmbeddings(model="models/embedding-001"), 
                                    breakpoint_threshold_type="standard_deviation", 
                                    breakpoint_threshold_amount=2)
    data_path = Path("../data")
    data_path.mkdir(parents=True, exist_ok=True)
    files = [file_path for file_path in data_path.iterdir()]
    sample_file = files[0]

    with open(sample_file, "r") as f: 
        lines = f.read()
    
    chunk_data = Path("../chunks")
    chunk_data.mkdir(parents=True, exist_ok=True)
    
    docs = text_splitter.create_documents([lines])
    doc_contents = []
    for idx, doc in enumerate(docs):
        doc_contents.append(doc.page_content)
        with open(chunk_data / f"sample_chunk_{idx}.txt", "w") as f: 
            f.write(doc.page_content)
    
    music_path = data_path / "music"
    music_path.mkdir(parents=True, exist_ok=True)
    
    return [
        {"text": doc_contents[0], 
         "audio_path": music_path / f"{sample_file.stem}_intro.wav"},
        {"text": doc_contents[-1],
         "audio_path": music_path / f"{sample_file.stem}_outro.wav"}
    ]
             
        
if __name__ == "__main__": 
    print(chunk())