// L2 clan crest encoder. The server stores crests as Crest_<id>.bmp in
// game/data/crests — despite the extension they are DDS DXT1 textures:
// 128-byte header + 128 bytes of DXT1 data for a 16x16 image (16x12 visible
// in-game, bottom 4 rows unused). Header layout copied byte-for-byte from the
// pack's own crest files.
const Jimp = require("jimp");

// Exact 128-byte DDS header observed in the server's crest files (16x16 DXT1).
function ddsHeader() {
  const h = Buffer.alloc(128);
  h.write("DDS ", 0, "ascii");
  h.writeUInt32LE(124, 4);        // dwSize
  h.writeUInt32LE(0x00081007, 8); // dwFlags (CAPS|HEIGHT|WIDTH|PIXELFORMAT|LINEARSIZE)
  h.writeUInt32LE(16, 12);        // height
  h.writeUInt32LE(16, 16);        // width
  h.writeUInt32LE(128, 20);       // linear size of DXT1 data
  h.writeUInt32LE(32, 76);        // pixelformat dwSize
  h.writeUInt32LE(0x4, 80);       // pixelformat flags: FOURCC
  h.write("DXT1", 84, "ascii");
  return h;                        // rest stays zero — matches the pack's files
}

const to565 = (r, g, b) => ((r >> 3) << 11) | ((g >> 2) << 5) | (b >> 3);
const from565 = (c) => [((c >> 11) & 31) * 255 / 31, ((c >> 5) & 63) * 255 / 63, (c & 31) * 255 / 31];

// Encode one 4x4 block (array of 16 [r,g,b]) into 8 bytes of DXT1 (opaque mode).
function encodeBlock(px) {
  // Range-fit: endpoints = the two most distant pixels along the luminance axis.
  let lo = px[0], hi = px[0];
  const lum = ([r, g, b]) => r * 0.299 + g * 0.587 + b * 0.114;
  for (const p of px) { if (lum(p) < lum(lo)) lo = p; if (lum(p) > lum(hi)) hi = p; }
  let c0 = to565(hi[0], hi[1], hi[2]), c1 = to565(lo[0], lo[1], lo[2]);
  if (c0 < c1) [c0, c1] = [c1, c0];
  if (c0 === c1 && c0 > 0) c1 = c0 - 1; // force 4-color (opaque) mode
  const p0 = from565(c0), p1 = from565(c1);
  const palette = [p0, p1,
    [(2 * p0[0] + p1[0]) / 3, (2 * p0[1] + p1[1]) / 3, (2 * p0[2] + p1[2]) / 3],
    [(p0[0] + 2 * p1[0]) / 3, (p0[1] + 2 * p1[1]) / 3, (p0[2] + 2 * p1[2]) / 3]];
  let bits = 0n;
  for (let i = 15; i >= 0; i--) {
    let best = 0, bd = Infinity;
    for (let j = 0; j < 4; j++) {
      const d = (px[i][0] - palette[j][0]) ** 2 + (px[i][1] - palette[j][1]) ** 2 + (px[i][2] - palette[j][2]) ** 2;
      if (d < bd) { bd = d; best = j; }
    }
    bits = (bits << 2n) | BigInt(best);
  }
  const out = Buffer.alloc(8);
  out.writeUInt16LE(c0, 0); out.writeUInt16LE(c1, 2); out.writeUInt32LE(Number(bits & 0xffffffffn), 4);
  return out;
}

// imageBuffer (any png/jpg/bmp) -> { dds: 256-byte crest file, preview: Jimp 16x12 }
async function encodeCrest(imageBuffer) {
  const src = await Jimp.read(imageBuffer);
  src.cover(16, 12); // fill the visible crest area, cropping to fit
  const canvas = new Jimp(16, 16, 0x000000ff); // 16x16 texture, bottom 4 rows black
  canvas.composite(src, 0, 0);
  const rgba = canvas.bitmap.data;
  const blocks = [];
  for (let by = 0; by < 4; by++) for (let bx = 0; bx < 4; bx++) {
    const px = [];
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      const o = ((by * 4 + y) * 16 + (bx * 4 + x)) * 4;
      px.push([rgba[o], rgba[o + 1], rgba[o + 2]]);
    }
    blocks.push(encodeBlock(px));
  }
  return { dds: Buffer.concat([ddsHeader(), ...blocks]), preview: src };
}

module.exports = { encodeCrest };
