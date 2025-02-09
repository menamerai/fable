import os
import re

def parse_book(file_path, output_folder, chapter_pattern):
    """
    Parses a book text file, extracts chapters based on the given pattern, and saves each as a separate text file.
    
    :param file_path: Path to the book text file.
    :param output_folder: Folder where parsed chapters will be stored.
    :param chapter_pattern: Regular expression pattern to identify chapter headings.
    """
    # Ensure output folder exists
    os.makedirs(output_folder, exist_ok=True)

    # Read the entire book text
    with open(file_path, 'r', encoding='utf-8') as file:
        text = file.read()

    # Split the text into chapters using the provided pattern
    chapters = re.split(chapter_pattern, text)

    # Remove any leading empty text before the first chapter
    if not chapters[0].strip():
        chapters.pop(0)

    # Save each chapter as a separate file
    for i, chapter in enumerate(chapters):
        if chapter.strip():  # Ensure the chapter is not empty
            chapter_title = chapter.split("\n", 1)[0].strip()
            chapter_filename = f"{output_folder}/{i+1:02d} - {chapter_title}.txt"
            
            with open(chapter_filename, 'w', encoding='utf-8') as chapter_file:
                chapter_file.write(chapter.strip())

            print(f"Saved: {chapter_filename}")

# Example usage:

# # Parsing "Alice's Adventures in Wonderland" (CHAPTER + Roman numerals)
# parse_book('backend/data/books/alice_in_wonderland.txt', 'backend/data/books/Alice_Chapters', r'(?=CHAPTER\s+[IVXLCDM]+)')

# # Parsing "Treasure Island" (numbered chapters, starting with 1, 2, 3, etc.)
# parse_book('backend/data/books/treasure_island.txt', 'backend/data/books/Treasure_Island_Chapters', r'(?=\n\d+\n)')

# parse_book('backend/data/books/20000_leagues.txt', 'backend/data/books/20000_leagues_Chapters', r'(?=CHAPTER\s+[IVXLCDM]+)')

# parse_book('backend/data/books/gatsby.txt', 'backend/data/books/gatsby_Chapters', r'(?=Chapter\s+[1234567890]+)')