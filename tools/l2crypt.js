// L2 Ver41x file codec (Lineage2Ver413 etc.) — RSA block layer + zlib
// Format: 28-byte UTF-16LE header "Lineage2Ver413", then 128-byte RSA blocks.
// Decrypted block: byte[3] = size (<=124), data at offset 128 - size - ((124-size)%4).
// Concatenated plaintext: 4-byte LE uncompressed size + zlib stream.
const fs = require('fs');
const zlib = require('zlib');

const KEYS = {
  '413': {
    n: BigInt('0x97df398472ddf737ef0a0cd17e8d172f0fef1661a38a8ae1d6e829bc1c6e4c3cfc19292dda9ef90175e46e7394a18850b6417d03be6eea274d3ed1dde5b5d7bde72cc0a0b71d03608655633881793a02c9a67d9ef2b45eb7c08d4be329083ce450e68f7867b6749314d40511d09bc5744551baa86a89dc38123dc1668fd72d83'),
    dec: BigInt('0x35'),
    enc: null, // set from CLI if/when known
  },
  'encdec': {
    n: BigInt('0x75b4d6de5c016544068a1acf125869f43d2e09fc55b8b1e289556daf9b8757635593446288b3653da1ce91c87bb1a5c18f16323495c55d7d72c0890a83f69bfd1fd9434eb1c02f3e4679edfa43309319070129c267c85604d87bb65bae205de3707af1d2108881abb567c3b3d069ae67c3a4c6a3aa93d26413d4c66094ae2039'),
    dec: BigInt('0x1d'),
    enc: BigInt('0x30b4c2d798d47086145c75063c8e841e719776e400291d7838d3e6c4405b504c6a07f8fca27f32b86643d2649d1d5f124cdd0bf272f0909dd7352fe10a77b34d831043d9ae541f8263c6fe3d1c14c2f04e43a7253a6dda9a8c1562cbd493c1b631a1957618ad5dfe5ca28553f746e2fc6f2db816c7db223ec91e955081c1de65'),
  },
};

function modPow(base, exp, mod) {
  let result = 1n; base %= mod;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    exp >>= 1n;
  }
  return result;
}
const toBig = (buf) => BigInt('0x' + buf.toString('hex'));
function toBuf(big, len) {
  let hex = big.toString(16).padStart(len * 2, '0');
  return Buffer.from(hex, 'hex');
}

function decrypt(file, key) {
  const raw = fs.readFileSync(file);
  const header = raw.slice(0, 28).toString('utf16le');
  if (!/^Lineage2Ver41\d$/.test(header)) throw new Error('bad header: ' + header);
  const body = raw.slice(28);
  const chunks = [];
  for (let off = 0; off + 128 <= body.length; off += 128) {
    const block = toBuf(modPow(toBig(body.slice(off, off + 128)), key.dec, key.n), 128);
    const size = block[3];
    if (size > 124) throw new Error('block size too large: ' + size + ' at ' + off);
    const start = 128 - size - ((124 - size) % 4);
    chunks.push(block.slice(start, start + size));
  }
  let plain = Buffer.concat(chunks);
  const uncompressedSize = plain.readUInt32LE(0);
  const inflated = zlib.inflateSync(plain.slice(4));
  if (inflated.length !== uncompressedSize)
    console.error(`warn: size header ${uncompressedSize} != inflated ${inflated.length}`);
  return inflated;
}

function encrypt(data, key, headerVer) {
  if (!key.enc) throw new Error('no encryption exponent for this key');
  const sizeHdr = Buffer.alloc(4);
  sizeHdr.writeUInt32LE(data.length, 0);
  const deflated = Buffer.concat([sizeHdr, zlib.deflateSync(data, { level: 9 })]);
  const blocks = [];
  for (let off = 0; off < deflated.length; off += 124) {
    const chunk = deflated.slice(off, Math.min(off + 124, deflated.length));
    const size = chunk.length;
    const block = Buffer.alloc(128);
    block[3] = size;
    const start = 128 - size - ((124 - size) % 4);
    chunk.copy(block, start);
    blocks.push(toBuf(modPow(toBig(block), key.enc, key.n), 128));
  }
  const enc = Buffer.concat(blocks);
  const header = Buffer.from('Lineage2Ver' + headerVer, 'utf16le');
  // 20-byte tail: CRC32 of header+encrypted blocks, little-endian at offset 12
  const tail = Buffer.alloc(20);
  tail.writeUInt32LE(zlib.crc32(Buffer.concat([header, enc])) >>> 0, 12);
  return Buffer.concat([header, enc, tail]);
}

// CLI: node l2crypt.js dec <in> <out> [keyname] | enc <in> <out> [keyname] [ver]
const [, , cmd, inFile, outFile, keyName = '413', ver = '413'] = process.argv;
const key = KEYS[keyName];
if (cmd === 'dec') {
  fs.writeFileSync(outFile, decrypt(inFile, key));
  console.log('decrypted ->', outFile);
} else if (cmd === 'enc') {
  fs.writeFileSync(outFile, encrypt(fs.readFileSync(inFile), key, ver));
  console.log('encrypted ->', outFile);
} else {
  console.log('usage: node l2crypt.js dec|enc <in> <out> [key] [ver]');
}
