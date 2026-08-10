#!/usr/bin/env node
/* eslint-disable */
"use strict";

/**
 * 把「所有模板里逐字节相同」的文件抽到 templates/_shared/，各模板只留不同的部分。
 *
 * 为什么要做：三个模板同源，字体 / 图片 / pdf worker 这类二进制资产是一模一样的，
 * 各存一份等于把包体乘三。而这个包是 `npm create` 的入口，**每次创建项目都要下载**，
 * 用户还只用其中一个模板。实测：模板总量 23.0 MiB -> 9.2 MiB。
 *
 * 生成项目时由 index.js 先铺 _shared 再铺所选模板（同名以模板为准），结果与去重前逐字节一致。
 *
 * 每次都先「复原」再重算：sync 可能只同步了其中一个模板，此时其余模板在磁盘上是缺
 * 共享文件的残缺态，直接算交集会把本该共享的文件误判成差异文件。
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..");
const TEMPLATES_DIR = path.join(ROOT, "templates");
const SHARED = path.join(TEMPLATES_DIR, "_shared");

const md5 = (p) => crypto.createHash("md5").update(fs.readFileSync(p)).digest("hex");

function walk(dir, base = dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, base, out);
    else out.push(path.relative(base, p));
  }
  return out;
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

const names = fs
  .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
  .filter((e) => e.isDirectory() && e.name !== "_shared")
  .map((e) => e.name);

if (names.length < 2) {
  console.log("模板少于 2 个，无需去重。");
  process.exit(0);
}

// 1) 复原：把 _shared 铺回每个模板，让它们各自完整
if (fs.existsSync(SHARED)) {
  for (const rel of walk(SHARED)) {
    for (const n of names) {
      const dest = path.join(TEMPLATES_DIR, n, rel);
      if (!fs.existsSync(dest)) copyFile(path.join(SHARED, rel), dest);
    }
  }
  fs.rmSync(SHARED, { recursive: true, force: true });
}

// 2) 算交集：所有模板都有、且内容一致的文件
const maps = {};
for (const n of names) {
  const dir = path.join(TEMPLATES_DIR, n);
  maps[n] = new Map(walk(dir).map((rel) => [rel, md5(path.join(dir, rel))]));
}

const first = names[0];
const shared = [];
for (const [rel, hash] of maps[first]) {
  if (names.every((n) => maps[n].get(rel) === hash)) shared.push(rel);
}

// 3) 抽出去
let bytes = 0;
for (const rel of shared) {
  const src = path.join(TEMPLATES_DIR, first, rel);
  bytes += fs.statSync(src).size;
  copyFile(src, path.join(SHARED, rel));
  for (const n of names) fs.rmSync(path.join(TEMPLATES_DIR, n, rel), { force: true });
}

// 清掉抽空后剩下的空目录
function pruneEmpty(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) pruneEmpty(path.join(dir, e.name));
  }
  if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
}
for (const n of names) pruneEmpty(path.join(TEMPLATES_DIR, n));

const totalAfter = names.reduce(
  (sum, n) =>
    sum +
    walk(path.join(TEMPLATES_DIR, n)).reduce(
      (s, rel) => s + fs.statSync(path.join(TEMPLATES_DIR, n, rel)).size,
      0
    ),
  0
) + bytes;

console.log(
  `✓ 去重：${shared.length} 个文件抽到 _shared/（单份 ${(bytes / 1024 / 1024).toFixed(1)} MiB），` +
    `模板总量 ${(totalAfter / 1024 / 1024).toFixed(1)} MiB`
);
