# open-wspWeb-bot
Bot de whatsapp basico para añadir gente a grupos, dicho sistema es extensible a más comandos o funciones

## Necesario
```Console
  NodeJS: https://nodejs.org/es/download
```
## Instalar dependencias y primera ejecución
Una vez descargado abrimos una consola en la carpeta del proyecto y corremos los siguientes comandos
```Console
  npm i
  npm start
```
en caso de ser necesario para el paso anterior, es posible que debamos hacer un downgrade de nodeJS
```Console
  npm install -g npm@6.14.18
```
Aparecerá un qr que debemos escanear para poder darle acceso al whatsapp que queremos usar
![image](https://github.com/luichinni/open-wspWeb-bot/assets/98102676/6758495d-f7ea-4346-9873-7b40d0a63c55)

Una vez escaneado esperamos que carguen los chats (barra de carga integrada para conocer el porcentaje de carga) y a recibir el mensaje "Bot Activo!"

![image](https://github.com/luichinni/open-wspWeb-bot/assets/98102676/3a76a3cf-3dc8-4598-b632-e9a7022ac640)

Hechos estos pasos el bot está listo para usarse.

# Comandos
El simbolo para efectuar los comandos puede ser modificado desde el código en la constante "cmdSimbolo"
| Comando | Descripcion |
| --- | --- |
|!info| Muestra los comandos disponibles segun usuario o admin corresponda, los comandos son tomados directamente de la carpeta comandos.|
|!grupos buscar \<texto>| Busca en la bd grupos cuyo nombre contenga el texto pasado por comando y muestra los codigos de dichos grupos.|
|!grupos invitar \<codigo>| Intenta agregar al usuario al grupo cuyo codigo fue pasado por comando, si el usuario no puede ser agregado, se le envia la invitacion por privado.|
|(admin) !agregar| Al ser usado en un grupo donde se sea admin, este se agrega a la base de datos dandole un código hasheado para ser localizado por grupos buscar|
|(admin) !eliminar| Al ser usado en un grupo donde se sea admin, si el grupo existe en la bd, es eliminado.|

## Creacion de comandos nuevos
Para crear un comando se debe generar un archivo .js en la carpeta ./comandos/ siendo la sintaxis la siguiente:

```javascript
// creamos un archivo "getHolaMundo.js"
module.exports = {
    // si bien el comando es tomado del nombre del archivo, esta informacion es usada para ayudar al usuario a guiarse
    comando : 'getHolaMundo', // nombre del comando
    params: '<parametro>', // parametros del comando (dejar vacio si no es necesario)
    visible: true, // visibilidad ante usuarios, un admin ve todos los comandos
    info: 'este comando sirve para ...' // informacion del comando
}
module.exports.ejecutar = function (msg) {
/*
  funcion del comando, siempre reciben msg y se llaman ejecutar, en caso de querer recibir más parametros
  se debe modificar el index.js para recibir un caso especial
*/
    msg.reply('Hola Mundo!');
}
```
