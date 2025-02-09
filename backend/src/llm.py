import os
from dotenv import load_dotenv
from google import genai
from pathlib import Path
import json

# Define the folder path
FOLDER_PATH = Path("./data/ambience")

# Mapping of ambience descriptions to file names
sound_files = {
    "Forest birds": "mixkit-forest-birds-ambience-1210.wav",
    "Jungle rain and birds": "mixkit-jungle-rain-and-birds-2392.wav",
    "Thunder rumble during a storm": "mixkit-thunder-rumble-during-a-storm-2395.wav",
    "Campfire night wind": "mixkit-campfire-night-wind-1736.wav",
    "Crickets and insects in the wild": "mixkit-crickets-and-insects-in-the-wild-ambience-39.wav",
    "Light rain loop": "mixkit-light-rain-loop-1253.wav",
    "Huge crowd cheering victory": "mixkit-huge-crowd-cheering-victory-462.wav",
    "Tactical drone": "mixkit-tactical-drone-ambience-2744.wav",
    "Natural sounds with flowing water and birds": "mixkit-natural-ambience-with-flowing-water-and-birds-61.wav",
    "Rain long loop": "mixkit-rain-long-loop-2394.wav",
    "Big army crowd marching": "mixkit-big-army-crowd-marching-461.wav",
    "Nature sounds with lightning strike and thunder": "mixkit-nature-ambience-with-lightning-strike-and-thunder-3093.wav",
    "Heavy rain drops": "mixkit-heavy-rain-drops-2399.wav",
    "Morning birds": "mixkit-morning-birds-2472.wav",
    "Very crowded pub or party loop": "mixkit-very-crowded-pub-or-party-loop-360.wav",
    "Angry male crowd": "mixkit-angry-male-crowd-ambience-458.wav",
    "Cinematic mystery heartbeat transition": "mixkit-cinematic-mystery-heartbeat-transition-492.wav",
    "Birds in forest loop": "mixkit-birds-in-forest-loop-1239.wav",
    "Creepy tomb": "mixkit-creepy-tomb-ambience-2500.wav",
    "Busy park playground with kids playing": "mixkit-busy-park-playground-with-kids-playing-2264.wav",
    "Farm animals in the morning": "mixkit-farm-animals-in-the-morning-7.wav",
    "Urban sounds during the day": "mixkit-urban-ambience-during-the-day-2505.wav",
    "Thunderstorm and rain loop": "mixkit-thunderstorm-and-rain-loop-2402.wav",
    "Horror sounds": "mixkit-horror-ambience-2482.wav",
    "Beach waves with children": "mixkit-beach-waves-with-children-ambience-1193.wav",
    "City traffic background": "mixkit-city-traffic-background-ambience-2930.wav",
    "Street sounds with walking people": "mixkit-street-ambience-with-walking-people-375.wav",
    "Heavy rain and thunder in background": "mixkit-heavy-rain-and-thunder-in-background-2406.wav",
    "Urban city sounds and light car traffic": "mixkit-urban-city-sounds-and-light-car-traffic-369.wav",
    "Night crickets near the swamp": "mixkit-night-crickets-near-the-swamp-1782.wav",
    "Office sounds": "mixkit-office-ambience-447.wav",
    "Restaurant crowd talking": "mixkit-restaurant-crowd-talking-ambience-444.wav",
    "Futuristic sci-fi computer": "mixkit-futuristic-sci-fi-computer-ambience-2507.wav",
    "People in fair with laughter": "mixkit-people-in-fair-ambience-and-laughter-368.wav"
}

def get_ambience_file(ambience_name):
    """
    Returns the absolute file path for the given ambience name.
    
    :param ambience_name: The descriptive name of the ambience.
    :return: Full file path of the corresponding sound file or None if not found.
    """
    if ambience_name in sound_files:
        return FOLDER_PATH / sound_files[ambience_name] 
    else:
        print(f"Warning: Ambience '{ambience_name}' not found.")
        return None

async def gemini_generate_ambience(text_file: str, json_file: list) -> str:
    load_dotenv()
    templates_path = Path("./templates")
    data_path = Path("./data")
    templates_path.mkdir(parents=True, exist_ok=True)

    guide_path = templates_path / "daniel_sample.txt"
    
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    with open(guide_path, "r", encoding='utf-8') as f:
        guide_text = f.read()
    
    with open(text_file, "r") as f: 
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
        temp["audio_path"] = get_ambience_file(audio_desc["ambience"]).name
        temp["text"] = audio_desc["text"]  
        output.append(temp)

    json_file[0]["audio_path"] = json_file[0]["audio_path"].name
    json_file[1]["audio_path"] = json_file[1]["audio_path"].name
    
    with open(data_path / "selection" / f"{Path(text_file).stem}.json", "w") as f: 
        json.dump({
            "start": json_file[0],
            "end": json_file[1],
            "ambience": output
        }, f, indent=4)

def main():
    print("Me when I'm Rai!")
    
if __name__ == "__main__": 
    main()