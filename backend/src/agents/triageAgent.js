import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function triageIssue(userIssue) {
    const systemPrompt = `
    You are the Triage Agent for a legal assistance AI. Your job is to intercept a user's legal issue, assign a Severity Score, and route it to the appropriate mode.

    # Modes:
    1. EXECUTOR: For Civil/Everyday issues (e.g., consumer court, rent disputes, traffic tickets, gig economy contracts).
    2. NAVIGATOR: For Criminal/Serious issues (e.g., harassment, physical threats, severe fraud, criminal charges).

    # Severity Score:
    Assign a score from 1 to 10.
    - 1-4: Low severity (Civil, procedural, financial disputes).
    - 5-7: Medium severity (Complex civil, minor fraud, escalating disputes).
    - 8-10: High severity (Criminal, physical danger, severe financial ruin, urgent legal deadlines).

    # Routing Rules:
    - If the issue is Civil/Everyday (Severity 1-6 usually), route to "executor".
    - If the issue is Criminal/Serious (Severity 7-10 usually), route to "navigator".

    You must respond ONLY with a valid JSON object. Do not include markdown formatting or extra text.
    Format:
    {
      "severityScore": number,
      "mode": "executor" | "navigator",
      "category": "string (e.g., Rent Dispute, Criminal Harassment)",
      "reasoning": "A brief 1-sentence explanation of why it was routed this way."
    }`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Here is my legal issue: "${userIssue}"` }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        const responseContent = completion.choices[0].message.content;
        return JSON.parse(responseContent);
    } catch (error) {
        console.error("Error in Triage Agent:", error);
        throw new Error("Failed to triage the legal issue.");
    }
}