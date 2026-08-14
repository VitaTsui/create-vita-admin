# create-vita-admin

[![npm version](https://img.shields.io/npm/v/create-vita-admin.svg)](https://www.npmjs.com/package/create-vita-admin)
[![license](https://img.shields.io/npm/l/create-vita-admin.svg)](./LICENSE)

一键创建基于 [`@hsu-react/ui`](https://www.npmjs.com/package/@hsu-react/ui) 的中后台管理项目脚手架——
无需 `git clone`，模板内嵌在包里，离线可用。

## 使用

```bash
# npm
npm create vita-admin@latest my-app

# 或 pnpm
pnpm create vita-admin my-app

# 或 npx
npx create-vita-admin my-app
```

不带 `--template` 时会让你选模板；也可以直接指定：

```bash
npm create vita-admin@latest my-app -- --template vite
npx create-vita-admin my-app -t webpack
npx create-vita-admin --list          # 只看有哪些模板
```

## 模板

| 模板 | 技术栈 | 什么时候选 |
| --- | --- | --- |
| `vite`（默认） | Vite 8 + Ant Design 6 + `@hsu-react/ui` 2.x | 新项目就选它。dev 冷启动约 0.1s |
| `webpack` | webpack 5 + Ant Design 6 + `@hsu-react/ui` 2.x | 团队已有 webpack 定制、暂时不迁 Vite |
| `antd5` | webpack 5 + Ant Design 5 + `@hsu-react/ui` 1.x | 项目必须停留在 antd v5。该线只收 bugfix |

`vite` 与 `webpack` 的业务代码是**同一套**，只差构建工具；`antd5` 是上一条大版本线。
antd 5 与 6 无法共存，选错了迁移成本不低，建新项目前先确认后端/内部组件对 antd 版本的要求。

然后：

```bash
cd my-app
pnpm install  # 安装依赖
pnpm start    # 启动开发服务器（默认 3003，portfinder 自动顺延）
```

> 启动前在 `.env/.env.dev` 配好 `API_PROXY`（后端代理）与登录加密密钥（`CRYPTO_KEY` / `RSA_PUB_KEY`）。

## 生成的项目包含

- **框架**：React 18 + TypeScript + MobX +（Vite 8 或 webpack 5，随模板）
- **UI**：主要基于 `@hsu-react/ui`（Panel / Form / Table / Search / FormItem / Operate / Chart …），底层 Ant Design 6（`antd5` 模板为 5）
- **能力**：动态路由（后端菜单驱动）、权限控制、多标签页、主题切换、国际化、Axios 服务层、
  MobX store 基类（列表 / 表单 / CRUD）
- **页面脚手架**：`pnpm crt:lp` / `crt:fp` / `crt:lfp` / `crt:lmp` / `crt:dp` 一键生成各类页面
- **项目级 Claude skills**（`.claude/skills/`）：`page-creation` / `api-creation` /
  `options-management` / `menu-function-management` / `playwright-mcp-strategy` ——
  用 Claude Code 开发时自动遵循本框架的页面 / 接口 / 选项 / 菜单规范

## 与模板仓库的关系

每个模板对应 starter 仓库的一个分支，脚手架内嵌它们的快照；模板更新后发布
`create-vita-admin` 的新版本。

| 模板 | 来源 |
| --- | --- |
| `vite` | [vita-admin-starter-v2](https://github.com/VitaTsui/vita-admin-starter-v2) @ `feat/vite` |
| `webpack` | [vita-admin-starter-v2](https://github.com/VitaTsui/vita-admin-starter-v2) @ `main` |
| `antd5` | [vita-admin-starter](https://github.com/VitaTsui/vita-admin-starter) @ `main` |

### 维护（同步模板 + 发布新版本）

```bash
pnpm sync                 # 同步全部模板
pnpm sync vite            # 只同步某一个
STARTER_V2=/path/to/repo pnpm sync    # 源仓库不在同级目录时指定

npm version patch                  # 升补丁版本
npm publish --otp=<6位验证码>       # 发布（无构建步骤，上传很快）
git push --follow-tags             # 推送代码与版本标签
```

`pnpm sync` 用 `git archive` 从指定 ref 导出到 `templates/<name>/`，**不动你手上的工作区**
——三个模板来自同一个 clone 的不同分支，用 rsync 就得来回 checkout，还会把未提交的改动
卷进模板。同步时会把 `.gitignore` 改名为 `_gitignore`（规避 npm 对点 gitignore 的特殊处理），
`.claude` 下只保留 `skills/`（settings 是本机的）。

同步末尾会自动跑一次去重（也可单独 `pnpm dedupe:templates`）：三个模板同源，字体 / 图片 / pdf worker
这类二进制资产逐字节相同（257 个文件里有 217 个），各存一份会让这个**每次 `npm create` 都要
下载**的包体积乘三。去重把它们抽到 `templates/_shared/`，生成项目时先铺 `_shared` 再铺所选
模板（同名以模板为准），结果与去重前逐字节一致。实测包体 12.0 MB → 4.5 MB。

> 判定规则是「在**所有**模板里都存在且内容一致」，由脚本每次重算，所以新增模板或某个模板
> 换了字体都会被自动识别，不需要手工维护共享清单。

## 贡献

日常开发在 `develop` 分支进行（feature 分支合入 `develop`），`main` 只接受来自 `develop` 的 PR；合入 `main` 后按 `package.json` 版本自动打 tag 并发布 npm。PR 标题遵循 [Conventional Commits](https://www.conventionalcommits.org/)。

## License

[MIT](./LICENSE) © VitaHsu
