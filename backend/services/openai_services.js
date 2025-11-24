const OpenAI = require("openai");
const dotenv = require("dotenv");
const Chat = require("../models/chat");
const HttpError = require("../models/http-error");

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const getAdvice = async (groupId, ownerId, aboutId, userMessage) => {
    // load chat history between owner (user A) and about (user B) for context
    const userChatHistory = await Chat.find({
        group_id: groupId,
        type: "user",
        $or: [
            { people: { $all: [ownerId, aboutId] } }
        ]
    })
    .populate("people")
    .populate("messages")
    .sort({ timestamp: -1 })
    .limit(15);

    // load or create a chat between ownerId and nugget
    let nuggetChat = await Chat.findOne({
        group_id: groupId,
        type: "nugget",
        owner: ownerId,
        about: aboutId
    });

    // i don't think we'll need this, it will be handled by chat controllers
    if (!nuggetChat) {
        nuggetChat = await Chat.create({
            group_id: groupId,
            type: "nugget",
            people: [ownerId],
            owner: ownerId,
            about: aboutId,
            messages: []
        });
    }

    const nuggetChatHistory = nuggetChat.messages.map(msg => ({
        role: msg.sender === "nugget" ? "assistant" : "user",
        content: msg.content
    }));

    const contextText = userChatHistory
        .reverse()
        .map(msg => `${msg.sender === ownerId ? "You" : "Them"}: ${msg.content}`)
        .join("\n");

        const system_prompt = `
            You are a Nugget, a friendly conflict-resolution coach for students who are working on a team project.
            Keep responses short, practical, emotionally intelligent, and supportive.
            Your goal is to help them improve teamwork, foster a healthy communication, not blaming anyone.

            Rules:
            - Don't give a response that is too long, pretend that you're in a personal chat with this person.
            - Avoid robotic structure, don't give response that is too AI.
        `

        const messages = [
            { role: "system", content: system_prompt },
            { role: "system", content: `Recent conversation:\n${contextText}` },
            ...nuggetChatHistory,
            { role: "user", content: userMessage }
        ]

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages
        });

        const botReply = response.choices[0].message.content;

        return botReply;
}

const reviseMessage = async (message) => {
    try {
        const system_prompt = `
            You are a tone-analysis assistant in a student group project setting.
            Users sometimes send messages to teammates who are not participating enough.
            Some messages can be aggressive or hostile, causing unhealthy conflict.
            Your job is to ONLY revise messages that are clearly rude, insulting, personally attacking, or hostile.

            Strict rules for revision:
            - Revise ONLY if the message contains personal attacks, blame, rudeness, profanity, sarcasm, or an aggressive confrontational tone.
            - If the message is simply direct, urgent, or straightforward but polite, DO NOT revise it.
            - If the original message contains NO bad words or hostility, return revise = false.
            - Use casual, human-like language with imperfections (like abbreviations, slang, humor, or a bit of randomness) when appropriate. Avoid robotic structure, overuse of punctuation, or sounding like AI.
            - Don't give long suggestions, try to keep the message length similar to the original message.
            - Use a tone that is appropriate to use between students, don't make it too formal.
            - Do NOT add unnecessary softening if the message is already polite.
            - Respond ONLY with valid JSON.

            Return format:
            - Return a JSON object with exactly two fields:
                1. "revise": true if the message is too aggressive or will result in an unhealthy confrontation, otherwise false
                2. "suggestion": a polite paraphrase of the message if revise is true, or an empty string if revise is false
            - Do NOT include any extra text outside the JSON.

            Example of case:
            1. If the user need to revise:
                Input message: "wth you can just tell us you couldn't do it"
                Output:
                {
                    "revise": true,
                    "suggestion": "you could have asked for help from the others if you need"
                }
            2. If the user does not need to revise:
                Input message: can you do your part by tonight?
                {
                    "revise": false,
                    "suggestion": ""
                }
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: system_prompt },
                { role: "user", content: message }
            ]
        });

        const raw_output = response.choices[0].message.content;

        // parse JSON
        let json_output;
        try {
            json_output = JSON.parse(raw_output);
        } catch {
            // fallback if OpenAI doesn't return the correct JSON format
            json_output = { revise: false, suggestion: "" };
        }
        
        return json_output;
    } catch (err) {
        console.error("OpenAI revise message error:", err);
        throw new HttpError("Failed to revise the message", 500);
    }
}

module.exports = {
    getAdvice,
    reviseMessage
}

// For testing purposes
// if (require.main === module) {
//     (async () => {
//         const dummyMessage = "when do you think you can finish your part?";
//         try {
//             const result = await reviseMessage(dummyMessage);
//             console.log("Test result:", result);
//         } catch (err) {
//             console.error("Error testing reviseMessage:", err);
//         }
//     })();
// }