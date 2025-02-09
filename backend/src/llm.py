import os
from dotenv import load_dotenv
from google import genai
from pathlib import Path
from ambience_retriever import get_ambience_file
import json

def gemini_generate_ambience(text_file: str, json_file: list) -> str:
    load_dotenv()
    templates_path = Path("./templates")
    data_path = Path("./data")
    templates_path.mkdir(parents=True, exist_ok=True)

    guide_path = templates_path / "daniel_sample.txt"
    
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    with open(guide_path, "r", encoding='utf-8') as f:
        guide_text = f.read()
    
    with open(data_path / text_file, "r") as f: 
        text = f.read()

    start_text = json_file[0]["text"]
    end_text = json_file[1]["text"]

    # remove start and end text because they already have their own audio files
    text = text.replace(start_text, "").replace(end_text, "")
    
    prompt = f"{guide_text}\n\n{text}"
    
    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=prompt
    )
    
    response_text = response.text.lstrip("```json").rstrip("```")
    json_data = json.loads(response_text)
    
    output = []
    
    for audio_desc in json_data: 
        temp = {} 
        temp["audio_path"] = get_ambience_file(audio_desc["ambience"])
        temp["text"] = audio_desc["text"]  
        output.append(temp)
    
    print(output)
    return output

def main():
    print("Me when I'm Rai!")
    
if __name__ == "__main__": 
    main()