const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const commandFolder = './comandos/';
const fs = require('fs');
const hash = require('hash.jas');

const cmdSimbolo = '.'; // modificar para tener un identificador diferente

const client = new Client({
    authStrategy: new LocalAuth()
})

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});


client.on("ready", () => {
    console.log("Bot Activo!");
});

// listado de comandos disponibles en la carpeta comandos
var arch = new Array();
fs.readdirSync(commandFolder).forEach(file => {
    if(file.endsWith('.js')){
        arch.push(commandFolder + file);
    }
});
var command = arch.map(require);

client.on("message_create", (msg)=> {
    if(msg.body.startsWith(cmdSimbolo)){
        // tomamos el cuerpo del comando
        var cmd = msg.body.toLowerCase().substring(1);
        // si es de info cargamos toda la data
        if(cmd === 'info'){
            var informa = 'Comandos disponibles:\n';
            command.forEach(cmm =>{
                informa+=cmdSimbolo+cmm.comando+': '+cmm.info+'\n';
            });
            msg.reply(informa);
        }else{ // si es un comando general buscamos si existe y lo ejecutamos
            var i = arch.indexOf(commandFolder + cmd + '.js');
            if (i != -1) {
                command[i].ejecutar(msg);
            }else{
                msg.reply('Ups, no parece un comando valido!');
            }
        }
    }
});

client.initialize();