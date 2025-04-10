const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { chat } = require("../scripts/chatgpt"); 
const fs = require("fs");
const path = require("path");

const pathInfo = path.join(__dirname, "../mensajes", "info.txt");
const businessInfo = fs.readFileSync(pathInfo, "utf8");


const gptFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, ctxFn) => {
        const prompt = `Eres un chatbot el primer mesanej o va hacer un pedido o va hacer una pregunta usa esto:\n${businessInfo}`;
        const text = ctx.body;

        // Recuperar el estado actual
        let userState = await ctxFn.state.getMyState() || {};
        userState.conversations = userState.conversations ?? [];
        const conversations = userState.conversations;

        // Crear el contexto con las últimas dos conversaciones
        const contextMessages = conversations.flatMap(conv => [
            { role: "user", content: conv.question },
            { role: "assistant", content: conv.answer }
        ]);

        // Añadir la pregunta actual al contexto
        contextMessages.push({ role: "user", content: text });

        // Obtener la respuesta de ChatGPT
        const response = await chat(prompt, contextMessages);

        // Actualizar el estado con la nueva conversación
        const newConversations = [...conversations, { question: text, answer: response }];
        if (newConversations.length > 2) {
            newConversations.shift(); // Mantener solo las últimas dos entradas
        }

        await ctxFn.state.update({ conversations: newConversations });

        // Enviar la respuesta al usuario
        await ctxFn.flowDynamic(response);
    });

module.exports = { gptFlow };