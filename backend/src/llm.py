import os
import json
from dotenv import load_dotenv
from google import genai
from pathlib import Path
from typing import Generator


# Define the folder path
AMBIENCE_FOLDER_PATH = Path("./data/ambience")
SHADOWS_FOLDER_PATH = Path("./data/shadows")

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
    "People in fair with laughter": "mixkit-people-in-fair-ambience-and-laughter-368.wav",
}

# Mapping of shadow descriptions to file names
shadow_files = {
    "fat man": "noun-fat-man-6086795.svg",
    "girl jumping or dancing": "noun-girl-jumping-or-dancing-4962002.svg",
    "happy family together": "noun-happy-family-together-5117457.svg",
    "father with two kids happy": "noun-father-with-two-kids-happy-5117454.svg",
    "girl reaching or falling": "noun-girl-reaching-or-falling-6503693.svg",
    "woman standing silhouette": "noun-woman-standing-silhouette-4961992.svg",
    "person waving": "noun-person-waving-4962006.svg",
    "elderly walking": "noun-elderly-walking-5312146.svg",
    "man dancing": "noun-man-dancing-5312115.svg",
    "people talking or arguing": "noun-people-talking-or-arguing-6086777.svg",
    "person walking": "noun-person-walking-4962005.svg",
    "woman angry or excited": "noun-woman-angry-or-excited-5048346.svg",
    "friends dancing ring a round the rosie": "noun-friends-dancing-ring-a-round-the-rosie5048342.svg",
    "person resting": "noun-person-resting-5048353.svg",
    "kid playing with a ball": "noun-kid-playing-with-a-ball-5312132.svg",
    "man thinking confused or stressed": "noun-man-thinking-confused-or-stressed-6199629.svg",
    "friends": "noun-friends-5048354.svg",
    "woman sitting down": "noun-woman-sitting-down-4962003.svg",
}


def get_ambience_file(ambience_name):
    """
    Returns the absolute file path for the given ambience name.

    :param ambience_name: The descriptive name of the ambience.
    :return: Full file path of the corresponding sound file or None if not found.
    """
    if ambience_name in sound_files:
        return AMBIENCE_FOLDER_PATH / sound_files[ambience_name]
    else:
        print(f"Warning: Ambience '{ambience_name}' not found.")
        return None


def get_shadow_file(shadow_name):
    """
    Returns the absolute file path for the given shadow name.

    :param shadow_name: The descriptive name of the shadow.
    :return: Full file path of the corresponding sound file or None if not found.
    """
    if shadow_name in shadow_files:
        return SHADOWS_FOLDER_PATH / shadow_files[shadow_name]
    else:
        print(f"Warning: Shadow '{shadow_name}' not found.")
        return None


async def gemini_generate_ambience(text_file: str, json_file: list) -> str:
    load_dotenv()
    templates_path = Path("./templates")
    data_path = Path("./data")
    templates_path.mkdir(parents=True, exist_ok=True)

    guide_path = templates_path / "daniel_sample.txt"

    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    with open(guide_path, "r", encoding="utf-8") as f:
        guide_text = f.read()

    with open(text_file, "r") as f:
        text = f.read()

    start_text = json_file[0]["text"]
    end_text = json_file[1]["text"]

    # remove start and end text because they already have their own audio files
    text = text.replace(start_text, "").replace(end_text, "")

    prompt = f"{guide_text}\n\n{text}"

    response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)

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
        json.dump(
            {"start": json_file[0], "end": json_file[1], "ambience": output},
            f,
            indent=4,
        )


def gemini_generate_music_prompt(json_file: list) -> str:
    load_dotenv()
    templates_path = Path("./templates")
    data_path = Path("./data")
    templates_path.mkdir(parents=True, exist_ok=True)

    guide_path = templates_path / "gemini_gen_music.txt"

    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    with open(guide_path, "r", encoding="utf-8") as f:
        guide_text = f.read()

    start_segment = json_file[0]["text"]
    end_segment = json_file[1]["text"]

    start_prompt = f"{guide_text}\n\n{start_segment}"
    end_prompt = f"{guide_text}\n\n{end_segment}"

    response_start = client.models.generate_content(
        model="gemini-2.0-flash", contents=start_prompt
    )
    response_end = client.models.generate_content(
        model="gemini-2.0-flash", contents=end_prompt
    )

    response_text_start = response_start.text.lstrip("```json").rstrip("```")
    response_text_end = response_end.text.lstrip("```json").rstrip("```")

    json_data_start = json.loads(response_text_start).get("prompt", "")
    json_data_end = json.loads(response_text_end).get("prompt", "")

    return {"start": json_data_start, "end": json_data_end}


async def gemini_get_shadow(text_file: str) -> str:
    load_dotenv()
    templates_path = Path("./backend/templates")
    data_path = Path("./backend/data/shadows")
    templates_path.mkdir(parents=True, exist_ok=True)
    data_path.mkdir(parents=True, exist_ok=True)  # Ensure the shadows directory exists

    guide_path = templates_path / "shadow_prompt.txt"

    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    with open(guide_path, "r", encoding="utf-8") as f:
        guide_text = f.read()

    with open(text_file, "r") as f:
        text = f.read()

    prompt = f"{guide_text}\n\n{text}"

    response = client.models.generate_content(model="gemini-2.0-flash", contents=prompt)

    response_text = response.text.lstrip("```json").rstrip("```")
    json_data = json.loads(response_text)

    output = []
    for entry in json_data.get("selected_moments", []):
        shadow_path = get_shadow_file(entry["silhouette"])
        if shadow_path:
            output.append(
                {
                    "impactful_sentence": entry["impactful_sentence"],
                    "shadow_path": str(shadow_path),
                }
            )

    # Ensure the directory exists before writing the file
    output_file = data_path / f"{Path(text_file).stem}.json"

    with open(output_file, "w") as f:
        json.dump(output, f, indent=4)

    print(f"Shadow data saved to: {output_file}")

def gemini_dyslexia_fix(content: str) -> Generator[str, None, None]:
    load_dotenv()
    templates_path = Path("./templates")
    templates_path.mkdir(parents=True, exist_ok=True)

    guide_path = templates_path / "dyslexia_prompt.txt"

    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    with open(guide_path, "r", encoding="utf-8") as f:
        guide_text = f.read()

    prompt = f"{guide_text}\n\n{content}"

    for chunk in client.models.generate_content_stream(model="gemini-2.0-flash", contents=prompt):
        yield chunk.text


def main():
    for chunk in gemini_dyslexia_fix("But all collected data had yet to be completely correlated and put together in all possible relationships."):
        print(chunk)


if __name__ == "__main__":
    main()
