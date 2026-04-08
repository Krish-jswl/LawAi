import Groq from 'groq-sdk';
import 'dotenv/config';
import { PDFParse } from 'pdf-parse';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function analyzeDocument(userQuestion, fileBuffer, mimeType) {
    let documentText = "";

    if (mimeType === 'application/pdf') {
        try {
            const parser = new PDFParse({ data: fileBuffer });
            const result = await parser.getText();
            documentText = result.text;

            if (typeof parser.destroy === 'function') {
                await parser.destroy();
            }

        } catch (error) {
            console.error("PDF Parsing Error:", error);
            throw new Error("Could not read the text inside this PDF.");
        }
    } else {
        throw new Error("Currently, only PDF files are supported for text extraction.");
    }

    const systemPrompt = `
        You are a helpful, grounded Legal Navigator.
        Your goal is to explain legal documents in simple, "human" language that a non-lawyer would easily understand.

        RULES:
        1. BREAK IT DOWN: Instead of just listing facts, explain what they mean in plain English.
        2. BE CONVERSATIONAL: Use a supportive, clear tone (e.g., "Essentially, this means..." or "In simple terms...").
        3. STICK TO THE FACTS: You must base your answer ONLY on the provided text. Do not invent details.
        4. ACCURACY: If the answer isn't in the document, simply say you can't find it.

        Structure your response so it's easy to read at a glance.
        `;

        const userPrompt = `
        I need you to explain this document to me like a friend who knows the law.

        --- DOCUMENT TEXT START ---
        ${documentText}
        --- DOCUMENT TEXT END ---

        My Question: ${userQuestion}
        `;

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.2,
    });

    return chatCompletion.choices[0].message.content;
}
