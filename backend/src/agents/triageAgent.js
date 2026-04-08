import Groq from 'groq-sdk';
import 'dotenv/config';

// Initialize Groq Client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function runTriage(userMessage) {
    const systemPrompt = `
    You are a Legal Triage AI. Analyze the user's problem.
    You must output ONLY a valid JSON object matching this schema:
    {
        "intent": "action" or "understand",
        "severity": "civil" or "criminal",
        "entity": "Name of the opposing party, or null if unknown"
    }
    `;

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `User Problem: ${userMessage}` }
        ],
        model: "llama3-8b-8192", // Extremely fast model for routing
        temperature: 0, // Keep it deterministic
        response_format: { type: "json_object" }, // Forces Groq to return perfect JSON
    });

    const jsonString = chatCompletion.choices[0].message.content;
    return JSON.parse(jsonString);
}
