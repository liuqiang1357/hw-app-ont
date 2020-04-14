const { utils } = require('ontology-ts-sdk');

function splitPath(path) {
  let result = [];
  let components = path.split('/');
  components.forEach(element => {
    let number = parseInt(element, 10);
    if (isNaN(number)) {
      throw Error(`Path ${path} is invalid.`);
    }
    if (element.length > 1 && element[element.length - 1] === "'") {
      number += 0x80000000;
    }
    result.push(number);
  });
  return result;
}

function convertPathToBuffer(path) {
  const paths = splitPath(path);
  const buffer = Buffer.alloc(paths.length * 4);
  paths.forEach((element, index) => {
    buffer.writeUInt32BE(element, 4 * index);
  });
  return buffer;
}

function convertDerToHex(response) {
  const ss = new utils.StringReader(response);
  // The first byte is format. It is usually 0x30 (SEQ) or 0x31 (SET)
  // The second byte represents the total length of the DER module.
  ss.read(2);
  // Now we read each field off
  // Each field is encoded with a type byte, length byte followed by the data itself
  ss.read(1); // Read and drop the type
  const r = ss.readNextBytes();
  ss.read(1);
  const s = ss.readNextBytes();

  // We will need to ensure both integers are 32 bytes long
  const integers = [r, s].map(i => {
    if (i.length < 64) {
      i = i.padStart(64, '0');
    }
    if (i.length > 64) {
      i = i.substr(-64);
    }
    return i;
  });
  return integers.join('');
}

module.exports = {
  splitPath,
  convertPathToBuffer,
  convertDerToHex,
}