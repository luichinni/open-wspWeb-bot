const hashFunction = require('../utilidades/hash.js');

module.exports = {
    comando: 'eliminar', // nombre del comando
    params: '', // parametros del comando
    visible: false, // invisible al usuario
    info: 'elimina un grupo de la db (solo admin) \nal usar este comando en un grupo, se elimina automaticamente de la db'// informacion del comando
}
module.exports.ejecutar = function (gp, db, campos) { // funcion del comando, siempre recibe msg
    let cod = hashFunction(gp.id._serialized); // hasheamos la invitacion
    //console.log(cod);
    let sql = `SELECT ${campos[1]} FROM ${campos[0]} WHERE ${campos[1]} = ?`; // medio hardcodeado jasj
    db.get(sql, [cod], (err,hs) => {
        if(err) console.log(err);
        if(hs !== undefined){
            sql = `DELETE FROM ${campos[0]} WHERE ${campos[1]} = ?`;
            db.run(sql,[cod]);
            gp.sendMessage('Eliminado correctamente!');
        }else{
            gp.sendMessage('No existe el grupo en la db');
        }
    });
    db.close();
}