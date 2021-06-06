const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const FRAME_FOLDER = './frames/';

let files = fs.readdirSync(FRAME_FOLDER).map(x => path.join(FRAME_FOLDER, x));


async function processFrame(name) {
    const frame = await Jimp.read(name);
    const out = [];

    for (let x = 7; x >= 0; x--) {
        let curWord = 0x0000;
        for (let y = 0; y < 6; y++) {
            const r_val = (frame.getPixelColor(x, y) & 0xFF000000) >>> 24;
            if (r_val < 127)
                curWord |= 1 << y;
        }
        out.push(`000${curWord.toString(16)}`.slice(-4))
    }
    return out;
}

async function convertFrames(array) {
    let stuff = [];
    for (let f of array) {
        stuff.push(await processFrame(f));
    }

    return stuff.flat(1).join('');
}

convertFrames(files.slice(0, 221)).then(x => console.log(x));