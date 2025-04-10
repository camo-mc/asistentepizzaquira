const { addKeyword, EVENTS } = require('@bot-whatsapp/bot');
const path = require('path');
const fs = require('fs');

const pathMenu = path.join(__dirname, "../mensajes", "menu.txt");
const menuText = fs.readFileSync(pathMenu, 'utf8');


const welcomeFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, ctxFn) => {
        const nombre = ctx?.pushName || "amig@"; // Fallback por si no trae el nombre

        // Saludo personalizado con el nombre de WhatsApp
        await ctxFn.flowDynamic(`👋 ¡Hola ${nombre}, bienvenido a Pizzaquira!`);

        // PDF
        await ctxFn.flowDynamic([
            {
                body: "📄 Aquí tenés el menú:",
                media: "http://localhost:4000/pdfs/restaurante-menu.pdf"
            }
        ]);

        // Menú
        await ctxFn.gotoFlow(require('./menu.flow').menuFlow);
    });

module.exports = { welcomeFlow };
