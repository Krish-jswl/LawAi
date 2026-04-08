import Groq from 'groq-sdk';
import 'dotenv/config';
import { PDFParse } from 'pdf-parse';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function analyzeDocument(userQuestion, fileBuffer, mimeType) {

    // ==========================================
    // SCENARIO 1: TEXT ONLY (NO FILE UPLOADED)
    // ==========================================
    if (!fileBuffer) {
        const textSystemPrompt = `
        You are KALPA AI, an autonomous Legal Navigator for Indian Law.
        
        CRITICAL GUARDRAILS:
        1. LEGAL MATTERS ONLY: You must ONLY answer questions related to law, civic issues, and legal procedures. If the user asks about coding, math, recipes, casual chat, or anything non-legal, you must politely refuse and state: "I am KALPA AI, a legal autonomous platform. I can only assist with legal matters."
        2. BNS STRICT COMPLIANCE: For all criminal law questions, you MUST strictly apply the new Bharatiya Nyaya Sanhita (BNS), 2023. Do not use the old IPC sections unless explicitly comparing them for context.
        3. FORMAT: Use clear bullet points, short sentences, and a highly empathetic tone. End by asking if they want to convert this complaint into an actionable legal draft.
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: textSystemPrompt },
                { role: "user", content: userQuestion }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.2,
        });

        return chatCompletion.choices[0].message.content;
    }

    // ==========================================
    // SCENARIO 2: IMAGE UPLOADED (VISION MODEL)
    // ==========================================
    if (mimeType.startsWith('image/')) {
        const base64Image = fileBuffer.toString('base64');
        const imageUrl = `data:${mimeType};base64,${base64Image}`;

        const visionSystemPrompt = `
        You are KALPA AI. The user has uploaded an image of a legal document, evidence, or complaint.
        RULES:
        1. Read the image carefully.
        2. Answer the user's question STRICTLY based on the visible text or context in the image.
        3. If the answer is not visible in the image, state that clearly.
        4. Use bullet points and a simple, conversational tone.
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: visionSystemPrompt },
                {
                    role: "user",
                    content: [
                        { type: "text", text: userQuestion },
                        { type: "image_url", image_url: { url: imageUrl } }
                    ]
                }
            ],
            model: "llama-3.2-11b-vision-preview", // Groq's ultra-fast vision model
            temperature: 0.1,
        });

        return chatCompletion.choices[0].message.content;
    }

    // ==========================================
    // SCENARIO 3: PDF UPLOADED
    // ==========================================
    if (mimeType === 'application/pdf') {
        let documentText = "";
        try {
            const parser = new PDFParse({ data: fileBuffer });
            const result = await parser.getText();
            documentText = result.text;
            if (typeof parser.destroy === 'function') await parser.destroy();
        } catch (error) {
            throw new Error("Could not read the text inside this PDF.");
        }

        const pdfSystemPrompt = `
        You are KALPA AI. 
        RULES:
        1. Answer the user's question STRICTLY based on the provided document text.
        2. Do not invent details. If it is not in the text, say you cannot find it.
        3. Explain it in simple English using bullet points.
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: pdfSystemPrompt },
                { role: "user", content: `--- DOCUMENT TEXT ---\n${documentText}\n\nMy Question: ${userQuestion}` }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
        });

        // Change your return statement at the bottom of the PDF section:
        return {
            answer: chatCompletion.choices[0].message.content,
            extractedText: documentText // Pass the raw text back!
        };
    }

    throw new Error("Unsupported file type. Please upload a PDF or an Image.");
}