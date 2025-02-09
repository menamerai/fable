import getpass
import os
from typing import List
from dotenv import load_dotenv
from pathlib import Path
from langchain_experimental.text_splitter import SemanticChunker
from langchain_google_genai import GoogleGenerativeAIEmbeddings


def chunk_text(file_path: Path) -> List[dict]:
    load_dotenv()

    text_splitter = SemanticChunker(
        GoogleGenerativeAIEmbeddings(model="models/embedding-001"),
        breakpoint_threshold_type="standard_deviation",
        breakpoint_threshold_amount=2,
    )

    # data_path = Path(f"/data/books")
    # data_path.mkdir(parents=True, exist_ok=True)

    with open(file_path, "r") as f:
        lines = f.read()

    # chunk_data = Path("../chunks")
    # chunk_data.mkdir(parents=True, exist_ok=True)

    chunks = text_splitter.split_text(lines)

    # doc_contents = []
    # for idx, doc in enumerate(docs):
    #     doc_contents.append(doc.page_content)
    # with open(chunk_data / f"sample_chunk_{idx}.txt", "w") as f:
    #     f.write(doc.page_content)

    music_path = Path(f"/data/music")
    music_path.mkdir(parents=True, exist_ok=True)

    return [
        {"text": chunks[0], "audio_path": music_path / f"{file_path.stem}_intro.wav"},
        {"text": chunks[-1], "audio_path": music_path / f"{file_path.stem}_outro.wav"},
    ]
