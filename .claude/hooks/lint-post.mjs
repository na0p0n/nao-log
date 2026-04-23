#!/usr/bin/env node
// PostToolUse hook: 記事 Markdown が編集されたら textlint を走らせる。
// 依存 (textlint) が未導入のときは何もしない (非ブロッキング)。

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const norm = (p) => p.replace(/\\/g, '/');

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => (input += chunk));
process.stdin.on('end', () => {
  let filePath = '';
  try {
    const payload = JSON.parse(input || '{}');
    filePath =
      payload?.tool_input?.file_path ??
      payload?.tool_input?.notebook_path ??
      '';
  } catch {
    return;
  }

  if (!filePath) return;
  const target = norm(resolve(filePath));
  const postsDir = norm(resolve('src/content/posts'));
  if (!target.startsWith(postsDir) || !target.endsWith('.md')) return;

  const bin = resolve(
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'textlint.cmd' : 'textlint',
  );
  if (!existsSync(bin)) return;

  try {
    execFileSync(bin, [filePath], { stdio: 'inherit' });
  } catch {
    // textlint の指摘は stderr に出ている。
    // フックはブロックしない (後続作業を妨げないため)。
  }
});
