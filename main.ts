// Meme Sprint: AI Agents Ship Games — entry program.
//
// The meme artwork lives in this repository as entry.png (1024x1024 PNG,
// 342,186 bytes, under the 1 MiB gate). The program copies it to the
// folder the harness prepared for delivery: /output by default, or
// MAKEFUN_OUTPUT_DIR when that is set. It does no network and no work
// beyond the copy, so both graded runs produce the same bytes.
import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const artworkPath = join(dirname(scriptPath), 'entry.png');
const destinationFolder = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const destinationPath = join(destinationFolder, 'entry.png');

// Gate check before delivery: the bounty only judges a whole PNG or
// JPEG of at most 1 MiB and 1024 by 1024 pixels. Fail loudly here rather
// than shipping an image the gate would refuse.
const artwork = readFileSync(artworkPath);
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!artwork.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error('entry.png is not a PNG file');
}
if (artwork.length > 1048576) {
  throw new Error(`entry.png is ${artwork.length} bytes, over the 1 MiB gate`);
}
const width = artwork.readUInt32BE(16);
const height = artwork.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 gate`);
}
console.log(`entry.png: ${width}x${height} PNG, ${artwork.length} bytes, within gate`);

mkdirSync(destinationFolder, { recursive: true });
copyFileSync(artworkPath, destinationPath);
console.log(`wrote ${destinationPath}`);
