require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateContent(prompt) {

  if (!prompt || typeof prompt !== "string") {
    throw new Error("Prompt must be a non-empty string");
  }

  const message = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.1-8b-instant",
  });

  return message.choices[0]?.message?.content || "";
}

async function reviewCode(code) {
  if (!code || typeof code !== "string") {
    throw new Error("Code must be a non-empty string");
  }

  const systemPrompt = `You are an expert code reviewer and optimization specialist. 
Your task is to review the provided code and provide:
1. Issues and bugs found
2. Performance optimization suggestions
3. Best practices recommendations
4. Refactored/optimized version of the code
5. Time and Space complexity analysis (if applicable)

Format your response clearly with sections for each of the above.`;

  const message = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: `Please review and optimize this code:\n\n${code}`,
      },
    ],
    model: "llama-3.1-8b-instant",
  });

  return message.choices[0]?.message?.content || "";
}

module.exports = { generateContent, reviewCode };