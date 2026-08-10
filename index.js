#!/usr/bin/env node
/* eslint-disable */
"use strict";

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";

function fail(msg) {
  console.error(`\x1b[31m✗ ${msg}${RESET}`);
  process.exit(1);
}

/**
 * 可选模板。顺序即交互式选择时的展示顺序，第一项是默认值。
 *
 * `vite` 与 `webpack` 只差构建工具，业务代码是同一套；`antd5` 是上一条大版本线，
 * 仅在项目必须停留在 antd v5 时才选。
 */
const TEMPLATES = [
  {
    name: "vite",
    title: "Vite + antd v6",
    desc: "推荐。@hsu-react/ui 2.x，Vite 8 构建（冷启动约 0.1s）",
  },
  {
    name: "webpack",
    title: "webpack + antd v6",
    desc: "@hsu-react/ui 2.x，webpack 5 构建。已有 webpack 定制时选它",
  },
  {
    name: "antd5",
    title: "webpack + antd v5",
    desc: "旧版本线：@hsu-react/ui 1.x，只收 bugfix。必须停留在 antd v5 时才选",
  },
];

const DEFAULT_TEMPLATE = TEMPLATES[0].name;
const templateNames = TEMPLATES.map((t) => t.name);

function printTemplates() {
  console.log(`\n可用模板：`);
  for (const t of TEMPLATES) {
    const tag = t.name === DEFAULT_TEMPLATE ? `${DIM}（默认）${RESET}` : "";
    console.log(`  ${CYAN}${t.name.padEnd(9)}${RESET}${t.title}${tag}`);
    console.log(`  ${" ".repeat(9)}${DIM}${t.desc}${RESET}`);
  }
  console.log("");
}

function printHelp() {
  console.log(`
${CYAN}create-vita-admin${RESET} — 快速创建基于 @hsu-react/ui 的中后台项目

用法:
  npm create vita-admin@latest <project-name> [options]
  npx create-vita-admin <project-name> [options]

选项:
  -t, --template <name>   指定模板，省略则交互式选择
      --list              列出所有模板
  -h, --help              显示本帮助
`);
  printTemplates();
}

// ---- 参数解析 -------------------------------------------------------------
// 手写而不引依赖：这个包是 `npm create` 的入口，装它的耗时直接摊在用户等待里，
// 保持零依赖就没有安装成本。
const argv = process.argv.slice(2);
let projectName;
let template;
let wantHelp = false;
let wantList = false;

for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "-h" || a === "--help") wantHelp = true;
  else if (a === "--list") wantList = true;
  else if (a === "-t" || a === "--template") template = argv[++i];
  else if (a.startsWith("--template=")) template = a.slice("--template=".length);
  else if (a.startsWith("-")) {
    // 未知开关：忽略，保持与旧版本一致（旧版本直接 filter 掉了所有 - 开头的参数）
  } else if (!projectName) projectName = a;
}

if (wantList) {
  printTemplates();
  process.exit(0);
}

if (wantHelp || !projectName) {
  printHelp();
  process.exit(0);
}

if (template && !templateNames.includes(template)) {
  console.error(`\x1b[31m✗ 未知模板：${template}${RESET}`);
  printTemplates();
  process.exit(1);
}

const targetDir = path.resolve(process.cwd(), projectName);
if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
  fail(`目标目录已存在且非空：${projectName}`);
}

// ---- 交互式选择 -----------------------------------------------------------

/**
 * 没给 -t 时让用户选。
 *
 * 非交互环境（CI、管道）直接用默认模板并说明——这里不能卡住等输入，否则 CI 会挂到超时。
 */
function pickTemplate() {
  if (template) return Promise.resolve(template);

  if (!process.stdin.isTTY) {
    console.log(
      `${DIM}非交互环境，使用默认模板 ${DEFAULT_TEMPLATE}（用 --template 指定其它）${RESET}`
    );
    return Promise.resolve(DEFAULT_TEMPLATE);
  }

  console.log(`\n${BOLD}选择模板：${RESET}`);
  TEMPLATES.forEach((t, i) => {
    const tag = i === 0 ? `${DIM} (默认)${RESET}` : "";
    console.log(`  ${CYAN}${i + 1}${RESET}) ${t.title}${tag}`);
    console.log(`     ${DIM}${t.desc}${RESET}`);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // stdin 被关掉（Ctrl-D、或调用方提前 EOF）时 question 的回调永远不会触发。
  // 只设个标记不够——**已经挂起的那个 promise 得有人去兑现**，否则进程一声不响地
  // 退出、什么都没生成（实测过）。这里在 close 时把当前挂起的问句按默认值兑现。
  let closed = false;
  let pending = null;
  rl.on("close", () => {
    closed = true;
    if (pending) {
      const resolve = pending;
      pending = null;
      resolve(TEMPLATES[0].name);
    }
  });

  const ask = () =>
    new Promise((resolve) => {
      if (closed) return resolve(TEMPLATES[0].name);
      pending = resolve;
      rl.question(`\n请输入序号 ${DIM}[1-${TEMPLATES.length}，回车用默认]${RESET}: `, (answer) => {
        pending = null;
        const raw = answer.trim();
        if (!raw) return resolve(TEMPLATES[0].name);

        const idx = Number(raw);
        if (Number.isInteger(idx) && idx >= 1 && idx <= TEMPLATES.length) {
          return resolve(TEMPLATES[idx - 1].name);
        }
        // 也接受直接输入模板名
        if (templateNames.includes(raw)) return resolve(raw);

        console.log(`${YELLOW}请输入 1-${TEMPLATES.length} 之间的序号，或模板名。${RESET}`);
        resolve(null);
      });
    });

  const loop = () =>
    ask().then((picked) => {
      if (picked) {
        rl.close();
        return picked;
      }
      // 输入无效且 stdin 还开着才重问，否则会死循环
      return closed ? TEMPLATES[0].name : loop();
    });

  return loop();
}

// ---- 生成 -----------------------------------------------------------------

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

pickTemplate().then((chosen) => {
  const meta = TEMPLATES.find((t) => t.name === chosen);
  const templateDir = path.join(__dirname, "templates", chosen);

  if (!fs.existsSync(templateDir)) {
    fail(`模板目录缺失：templates/${chosen}，包可能损坏，请重新安装。`);
  }

  console.log(
    `\n${DIM}正在创建项目 ${projectName}（模板：${meta.title}）...${RESET}`
  );

  // 先铺公共文件再铺模板自己的（同名以模板为准）。
  // 字体/图片这类二进制资产三个模板完全一样，抽到 _shared 后包体从 23 MiB 降到 9 MiB
  // —— 这个包每次 npm create 都要下载，而用户只用其中一个模板。
  const sharedDir = path.join(__dirname, "templates", "_shared");
  if (fs.existsSync(sharedDir)) copyDir(sharedDir, targetDir);
  copyDir(templateDir, targetDir);

  // _gitignore → .gitignore（npm 发包时会特殊对待 .gitignore，所以模板里存的是占位名）
  const ignoreSrc = path.join(targetDir, "_gitignore");
  if (fs.existsSync(ignoreSrc)) {
    fs.renameSync(ignoreSrc, path.join(targetDir, ".gitignore"));
  }

  // 改写 package.json：换成新项目的名字与版本，去掉模板作者
  const pkgPath = path.join(targetDir, "package.json");
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    pkg.name = projectName;
    pkg.version = "0.0.0";
    delete pkg.author;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  } catch {
    // 忽略：改不动 package.json 不致命
  }

  const stack =
    chosen === "antd5"
      ? "webpack 5 + Ant Design 5 + @hsu-react/ui 1.x"
      : chosen === "webpack"
        ? "webpack 5 + Ant Design 6 + @hsu-react/ui 2.x"
        : "Vite 8 + Ant Design 6 + @hsu-react/ui 2.x";

  console.log(`
${GREEN}✓ 项目创建完成：${projectName}${RESET}

技术栈：${stack}
内置：  动态路由 / 权限 / 多标签 / 主题 / i18n + @hsu-react/ui 组件库
        + 页面脚手架(crt:*) + 项目级 Claude skills(.claude/skills)

下一步:
  ${CYAN}cd ${projectName}${RESET}
  ${CYAN}yarn${RESET}            ${DIM}# 安装依赖${RESET}
  ${CYAN}yarn start${RESET}      ${DIM}# 启动开发服务器${RESET}

${DIM}启动前记得在 .env/.env.dev 配好 API_PROXY 与登录加密密钥。${RESET}
`);
});
