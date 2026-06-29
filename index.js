#!/usr/bin/env node
/* eslint-disable */
"use strict";

const fs = require("fs");
const path = require("path");

const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const DIM = "\x1b[2m";

function fail(msg) {
  console.error(`\x1b[31m✗ ${msg}${RESET}`);
  process.exit(1);
}

// 解析项目名：`npm create vita-admin my-app` / `npx create-vita-admin my-app`
const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const projectName = args[0];

if (!projectName) {
  console.log(`
${CYAN}create-vita-admin${RESET} — 快速创建基于 @hsu-react/ui 的中后台项目

用法:
  npm create vita-admin@latest <project-name>
  npx create-vita-admin <project-name>
`);
  process.exit(0);
}

const targetDir = path.resolve(process.cwd(), projectName);
if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
  fail(`目标目录已存在且非空：${projectName}`);
}

const templateDir = path.join(__dirname, "template");
if (!fs.existsSync(templateDir)) {
  fail("模板目录缺失，包可能损坏，请重新安装。");
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

console.log(`\n${DIM}正在创建项目 ${projectName} ...${RESET}`);
copyDir(templateDir, targetDir);

// _gitignore → .gitignore（npm 发布时点 gitignore 会被特殊处理，模板里用 _gitignore 占位）
const ignoreSrc = path.join(targetDir, "_gitignore");
if (fs.existsSync(ignoreSrc)) {
  fs.renameSync(ignoreSrc, path.join(targetDir, ".gitignore"));
}

// 改写 package.json 的 name / version
const pkgPath = path.join(targetDir, "package.json");
try {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  pkg.name = projectName;
  pkg.version = "0.0.0";
  delete pkg.author;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
} catch (e) {
  // 忽略：package.json 改写失败不致命
}

console.log(`
${GREEN}✓ 项目创建完成：${projectName}${RESET}

内置：动态路由 / 权限 / 多标签 / 主题 / i18n + @hsu-react/ui 组件库
      + 页面脚手架(crt:*) + 项目级 Claude skills(.claude/skills)

下一步:
  ${CYAN}cd ${projectName}${RESET}
  ${CYAN}yarn${RESET}            ${DIM}# 安装依赖${RESET}
  ${CYAN}yarn start${RESET}      ${DIM}# 启动开发服务器${RESET}

${DIM}启动前记得在 .env/.env.dev 配好 API_PROXY 与登录加密密钥。${RESET}
`);
