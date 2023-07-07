module.exports = {
    comando: 'hola', // nombre del comando
    info: '-> responde hola a quien use el comando' // informacion del comando
}
module.exports.ejecutar = function (msg) { // funcion del comando, siempre recibe msg
    msg.reply('Holiwis!!');
}