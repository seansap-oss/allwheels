/**
 * Generates valid PNG app icons with zero dependencies (node:zlib only).
 * Solid Motora navy with a lighter inner panel + "M" block mark drawn
 * as raw pixels. Admin can replace logo/favicon/app icons later.
 */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "icons");
mkdirSync(root, { recursive: true });

function crc32(buf) {
  let table = crc32.t;
  if (!table) {
    table = crc32.t = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([td, data])));
  return Buffer.concat([len, td, data, crc]);
}

// Navy #0a1633 bg, teal-to-coral diagonal accent, white "M" via 5x7 bitmap.
const M = ["10001", "11011", "10101", "10101", "10001", "10001", "10001"];

function png(size, maskable) {
  const pad = maskable ? Math.floor(size * 0.12) : 0;
  const raw = Buffer.alloc(size * (1 + size * 4));
  let p = 0;
  for (let y = 0; y < size; y++) {
    raw[p++] = 0;
    for (let x = 0; x < size; x++) {
      const t = (x + y) / (2 * size); // diagonal gradient factor
      let r = Math.round(10 + t * 20);
      let g = Math.round(22 + t * 160);
      let b = Math.round(51 + t * 120);
      const inPad = pad && (x < pad || y < pad || x >= size - pad || y >= size - pad);
      if (inPad) {
        r = 10; g = 22; b = 51;
      }
      // M glyph centered
      const gw = size * 0.5, gh = size * 0.42;
      const gx = (size - gw) / 2, gy = (size - gh) / 2 - size * 0.02;
      const cx = Math.floor(((x - gx) / gw) * 5), cy = Math.floor(((y - gy) / gh) * 7);
      if (cx >= 0 && cx < 5 && cy >= 0 && cy < 7 && M[cy][cx] === "1") {
        r = 255; g = 255; b = 255;
      }
      raw[p++] = r; raw[p++] = g; raw[p++] = b; raw[p++] = 255;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

for (const [name, size, mask] of [["icon-192.png", 192, false], ["icon-512.png", 512, false], ["icon-maskable-512.png", 512, true]]) {
  writeFileSync(join(root, name), png(size, mask));
  console.log("wrote", name);
}
