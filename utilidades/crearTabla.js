function crearTabla (db,campos){
    let sql = `CREATE TABLE IF NOT EXISTS ${campos[0]}(${campos[1]}`;
    for(i in campos){
        if(campos[i]!==campos[0] && campos[i] !== campos[1]){
            sql+=`,`+campos[i];
        }
    }
    sql+=`)`;
    //console.log('creando tabla');
    db.run(sql);
    //console.log('tabla creada');
    //console.log(sql);
    db.close();
}

module.exports = crearTabla;