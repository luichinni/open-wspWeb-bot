module.exports = {
    comando: 'grupos invitar', // nombre del comando
    params: '<codigo>', // parametros del comando
    visible: true, // visible al usuario
    info: 'agrega al usuario al grupo solicitado por medio del <codigo> ingresado, se obtiene del comando grupos buscar' // informacion del comando
}
module.exports.ejecutar = function (msg, db, campos, client, contacto) { // funcion del comando, siempre recibe msg
    var grup = msg.body.split(' ')[2].toLowerCase(); // tomamos el codigo hash
    let sql = `SELECT ${campos[3]} FROM ${campos[0]} WHERE ${campos[1]} = '${grup}'`; // medio hardcodeado jasj
    db.get(sql, [], (err, grupo) => {
        if (err) console.log(err);
        if (grupo !== undefined) {
            client.getChatById(grupo.invitacion)
            .then((chat) => {
                //console.log(contacto);
                var existe = false;
                chat.participants.forEach(p => {
                    if(p.id._serialized === contacto.id._serialized){
                        existe = true;
                    }
                });
                if (!existe) {
                    chat.addParticipants([contacto.id._serialized]);
                }
            });
            setTimeout(() => { // el timeout a 5 segundo para darle tiempo a actualizar la lista de participantes
                client.getChatById(grupo.invitacion).then(async (gp) => {
                    var existe = false;
                    gp.participants.forEach(p => {
                        if (p.id._serialized === contacto.id._serialized) {
                            existe = true;
                        }
                    });
                    if (!existe) {
                        var c = await contacto.getChat();
                        await c.sendMessage('https://chat.whatsapp.com/' + await gp.getInviteCode());
                        setTimeout(() => { }, 3000);
                        msg.react('💭');
                    } else {
                        msg.react('🫰🏽');
                    }
                });
            },5000); 
        } else {
            msg.reply('No hay grupos que coincidan, intenta otro codigo!!');
        }
    });
    db.close();
}