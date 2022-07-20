// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');

fs = require('fs');
mime = require('mime-types');
var exec = require('child_process').exec;

venom
  .create({
    session: 'session-name', //name of session
    multidevice: false // for version not multidevice use false.(default: true)
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {

  client.onMessage(async (message) => {

      if (message.isMedia === true || message.isMMS === true) {
        const buffer = await client.decryptFile(message);
        var fileName = `./multimedia.${mime.extension(message.mimetype)}`;

        console.log(fileName);
        
        if(fileName === './multimedia.jpeg' || fileName === './multimedia.jpg' || fileName === './multimedia.png'){
          await fs.writeFile(fileName, buffer, async (err) => {
            if (err) {
            console.log(err)
            } else {
            await client
            .sendImageAsSticker(message.from, fileName)
            .then((result) => {
            console.log('Result: ', result); //return object success
            //  fs.unlinkSync(fileName);
            })
            .catch((erro) => {
            console.error('Error when sending: ', erro); //return object error
            });
            }
            });
        }

        if (fileName === './multimedia.mp4') {
          await fs.writeFile(fileName, buffer, (err) => {
            exec('start video2gif.bat multimedia.mp4 -o multimedia.gif -y -w 256:256 -f 10 -q 6', (error, stdout, stderr) => {
            if (error) {
            console.log(`error: ${error.message}`);
            return;
            }
            if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
            }
            client
            .sendImageAsStickerGif(message.from, 'multimedia.gif')
            .then((result) => {
            console.log('Result: ', result); //return object success
            })
            .catch((erro) => {
            console.error('Error when sending: ', erro); //return object error
            });
            });
            });
        }
      
    }
});
}

//ffmpeg -i multimedia.mp4 -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 800:600 out.webp
