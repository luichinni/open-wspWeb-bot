const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const commandFolder = './comandos/';
const fs = require('fs');
const crearTabla = require('./utilidades/crearTabla.js');
const sqlite3 = require('sqlite3');
const WAWebJS = require("whatsapp-web.js");

const cmdSimbolo = '.'; // modificar para tener un identificador diferente

// creamos la tabla si no existe
const pathDB = 'grupos.sqlite';
const db = new sqlite3.Database(pathDB, sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.log(err.message);
});
let campos = ['grupos', 'hash', 'nombre', 'invitacion'];
crearTabla(db,campos);
// fin creacion si no existe

const client = new Client({
    authStrategy: new LocalAuth()
})

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});
var iniciado = false;
client.on('loading_screen',(perc,msg)=>{
    if(iniciado){
        process.stdout.moveCursor(0, -2);
        process.stdout.clearLine();
    }else{
        iniciado=true;
    }
    console.log(msg);
    var rects = new Array((parseInt(parseInt(perc) * 25) / 100)).join('█');
    var barra = rects + new Array(25 - rects.length).join('░');
    console.log('\u001b[32m' + barra +'\u001b[37m'+' | '+perc+'%');
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

client.on("message_create", async (msg)=> {
    try{
        if(msg.type === WAWebJS.MessageTypes.TEXT){
            if (msg.body.startsWith(cmdSimbolo)) {
                // tomamos el cuerpo del comando
                var cmd = msg.body.toLowerCase().substring(1);
                // si es de info cargamos toda la data
                if (cmd === 'info') {
                    var informa = 'Comandos disponibles:\n';
                    command.forEach(cmm => {
                        if (cmm.visible || msg.fromMe) { // si soy admin puedo ver los comandos de admin
                            informa += cmdSimbolo + cmm.comando + ' '+ cmm.params + '\n' + cmm.info + '\n';
                        }
                    });
                    msg.reply(informa);
                } else { // si es un comando general buscamos si existe y lo ejecutamos
                    var i;
                    if (cmd.startsWith('grupos buscar') || cmd.startsWith('grupos invitar')) {
                        var partes = cmd.split(' ');
                        i = arch.indexOf(commandFolder + partes[0] + ' ' + partes[1] + '.js');
                    } else {
                        i = arch.indexOf(commandFolder + cmd + '.js');
                    }
                    if (i !== -1) {
                        if (msg.fromMe) { // comandos de admin
                            if (cmd === 'agregar') { // aca antes decia if(cmd.startsWith(cmdSimbolo+cmd))
                                let gp = await msg.getChat();
                                if (gp.isGroup) {
                                    if (gp.participants.find(chatO => chatO.id.user === client.info.wid.user).isAdmin) {
                                        const db = new sqlite3.Database(pathDB, sqlite3.OPEN_READWRITE, (err) => {
                                            if (err) return console.log(err.message);
                                        });
                                        command[i].ejecutar(gp, db, campos);
                                    }
                                } else {
                                    msg.reply('Este comando solo puede usarse en un grupo!')
                                }
                            } else if (cmd === 'eliminar') {
                                let gp = await msg.getChat();
                                if (gp.isGroup) {
                                    if (gp.participants.find(chatO => chatO.id.user === client.info.wid.user).isAdmin) {
                                        const db = new sqlite3.Database(pathDB, sqlite3.OPEN_READWRITE, (err) => {
                                            if (err) return console.log(err.message);
                                        });
                                        command[i].ejecutar(gp, db, campos);
                                    }
                                } else {
                                    msg.reply('Este comando solo puede usarse en un grupo!');
                                }
                            } else {
                                let c = (await msg.getContact());
                                cmdNormales(msg, i, cmd, c);
                            }
                        } else { // comandos normales
                            let c = (await msg.getContact());
                            cmdNormales(msg, i, cmd, c);
                        }
                    } else {
                        msg.reply('Ups, no parece un comando valido!');
                    }
                }
            }
        }
    }catch(err){
        console.log('Se rompio algo');
        console.log(err);
    }
});

function cmdNormales(msg,i,cmd,contacto){
    if (cmd.startsWith('grupos buscar')) {
        if('grupos buscar 12'.length < cmd.length){
            const db = new sqlite3.Database(pathDB, sqlite3.OPEN_READWRITE, (err) => {
                if (err) return console.log(err.message);
            });
            command[i].ejecutar(msg, db, campos);
        }else{
            msg.reply('Necesito 3 caracteres o más!!');
        }
    } else if(cmd.startsWith('grupos invitar')){
        if ('grupos buscar '.length < cmd.length) {
            const db = new sqlite3.Database(pathDB, sqlite3.OPEN_READWRITE, (err) => {
                if (err) return console.log(err.message);
            });
            command[i].ejecutar(msg, db, campos, client, contacto);
        } else {
            msg.reply('Debes ingresar un codigo valido!');
        }
    }else{
        command[i].ejecutar(msg);
    }
}

client.initialize();