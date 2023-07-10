module.exports = {
    comando: 'grupos buscar', // nombre del comando
    params: '<texto>', // parametros del comando
    visible: true, // visible al usuario
    info: 'busca grupos disponibles que coincidan con el texto <texto> debe ser una palabra o frase de al menos 3 letras' // informacion del comando
}
module.exports.ejecutar = function (msg,db,campos) { // funcion del comando, siempre recibe msg
    var grup = msg.body.substring(this.comando.length+2); // tomamos el codigo hash
    let sql = `SELECT ${campos[1]}, ${campos[2]} FROM ${campos[0]} WHERE ${campos[2]} LIKE '%${grup}%'`; // medio hardcodeado jasj
    db.all(sql, [], (err, lista) => {
        if (err) console.log(err);
        if(lista !== undefined && lista.length!==0){
            var encontrados = '\nGrupos que coinciden con ' + `*${grup}*`+ '\npara ser invitado usa el comando *grupos invitar <codigo>*\n' + '\n<codigo>\n';
            lista.forEach(grupo => {
                encontrados += grupo.hash.toUpperCase() + '   -   ' + grupo.nombre + '\n';
            });
            msg.reply(encontrados);
        }else{
            msg.reply('No hay grupos que coincidan, intenta otra palabra!!');
        }
    });
    db.close();
}