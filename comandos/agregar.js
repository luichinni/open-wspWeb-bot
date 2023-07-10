const hashFunction = require('../utilidades/hash.js');

module.exports = {
    comando: 'agregar', // nombre del comando
    params: '', // parametros del comando
    visible: false, // invisible al usuario
    info: 'agrega un grupo a la db (solo admin) \nal usar este comando en un grupo, se agrega automaticamente a la db'// informacion del comando
}
module.exports.ejecutar = function (gp,db,campos) { // funcion del comando, siempre recibe msg
    //let com = gp.body.substring(9).split(','); //quitamos el comando !agregar y separamos los parametros
    var estado = false;
    let cod = hashFunction(gp.id._serialized); // hasheamos la invitacion
    //console.log(cod);
    //let sql = `INSERT INTO ${campos[0]}("${campos[1]}","${campos[2]}","${campos[3]}") VALUES (?,?,?)`; // medio hardcodeado jasj
    //db.run(sql,[cod,gp.name,gp.id._serialized]);
    let sql = `SELECT ${campos[1]} FROM ${campos[0]} WHERE ${campos[1]} = ?`; // medio hardcodeado jasj
    db.get(sql, [cod], (err, hs) => {
        if (err) console.log(err);
        if (hs === undefined) {
            sql = `INSERT INTO ${campos[0]}("${campos[1]}","${campos[2]}","${campos[3]}") VALUES (?,?,?)`;
            db.run(sql, [cod, gp.name, gp.id._serialized]);
            gp.sendMessage('Agregado correctamente!');
        } else {
            gp.sendMessage('Hay colision de hash o el grupo ya existe en la db :P');
        }
    });
    db.close();
    return estado;
}