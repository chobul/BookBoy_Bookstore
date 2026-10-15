import fs from 'fs';
import path from 'path';

const OLD = 'http://localhost:3000';
const srcDir = path.resolve('src');

fs.writeFileSync(
  path.join(srcDir, 'config.js'),
  "export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';\n"
);

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });

let changed = 0;
for (const file of walk(srcDir)) {
  if (!/\.(jsx?|tsx?)$/.test(file)) continue;
  if (file.endsWith('config.js') || file.includes(`${path.sep}scripts${path.sep}`)) continue;
  let s = fs.readFileSync(file, 'utf8');
  if (!s.includes(OLD)) continue;
  s = s.replace(/'http:\/\/localhost:3000([^']*)'/g, '`${API_BASE}$1`');
  s = s.replace(/"http:\/\/localhost:3000([^"]*)"/g, '`${API_BASE}$1`');
  s = s.split(OLD).join('${API_BASE}');
  let rel = path.relative(path.dirname(file), path.join(srcDir, 'config.js'))
    .replace(/\\/g, '/').replace(/\.js$/, '');
  if (!rel.startsWith('.')) rel = './' + rel;
  s = `import { API_BASE } from '${rel}';\n` + s;
  fs.writeFileSync(file, s);
  changed++;
}
console.log('แก้แล้ว', changed, 'ไฟล์');