const fs = require("fs");
const path = require("path");

const rutaArchivo = path.join(__dirname, "../pedidos.json");

// Si no existe, lo crea con arreglo vacío
if (!fs.existsSync(rutaArchivo)) {
    fs.writeFileSync(rutaArchivo, "[]");
}

function guardarPedido(pedido) {
    const data = fs.readFileSync(rutaArchivo, "utf8");
    let pedidos = [];

    try {
        pedidos = JSON.parse(data);
    } catch (e) {
        pedidos = [];
    }

    pedidos.push(pedido);
    fs.writeFileSync(rutaArchivo, JSON.stringify(pedidos, null, 2));
}

module.exports = { guardarPedido };