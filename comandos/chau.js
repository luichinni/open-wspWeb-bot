module.exports = {
    comando : 'chau', // nombre del comando
    params: '', // parametros del comando
    visible: true, // visible al usuario
    info: '-> responde chau a quien use el comando' // informacion del comando
}
module.exports.ejecutar = function (msg) { // funcion del comando, siempre reciben msg
    msg.reply('Chaucha!!');
}