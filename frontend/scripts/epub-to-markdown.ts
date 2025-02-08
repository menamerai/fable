import { GoogleGenerativeAI } from '@google/generative-ai';
import AdmZip from 'adm-zip';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { JSDOM } from 'jsdom';

// Load environment variables
dotenv.config();

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error('GOOGLE_GEMINI_API_KEY environment variable is not set');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function epubToMarkdown(epubPath: string): Promise<string> {
  // Read and extract epub
  const zip = new AdmZip(epubPath);
  const zipEntries = zip.getEntries();

  // Find and concatenate all XHTML content
  let fullText = '';
  for (const entry of zipEntries) {
    if (
      entry.entryName.endsWith('.xhtml') ||
      entry.entryName.endsWith('.html')
    ) {
      const content = entry.getData().toString('utf8');
      const dom = new JSDOM(content);
      const textContent = dom.window.document.body.textContent || '';
      fullText += textContent + '\n\n';
    }
  }

  // Initialize Gemini model
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      maxOutputTokens: 1000000,
    },
  });

  // Prompt for markdown conversion
  const prompt = `
    Convert the following book text to clean, well-formatted markdown.
    Preserve chapter structure, headings, and paragraphs.
    Remove any technical artifacts or inconsistencies.
    Keep only the actual content of the book.
    Here's the text, wrapped in <book> tags:

    <book>
    ${fullText}
    </book>
  `;

  try {
    console.log('calling gemini');
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating markdown:', error);
    throw error;
  }
}

// Example usage:
epubToMarkdown('./dorian-gray.epub')
  .then((markdown) => fs.writeFileSync('output.md', markdown))
  .catch(console.error);

export { epubToMarkdown };
