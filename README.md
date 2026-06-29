# create-vita-admin

一键创建基于 [`@hsu-react/ui`](https://www.npmjs.com/package/@hsu-react/ui) 的中后台管理项目脚手架——
无需 `git clone`，模板内嵌在包里，离线可用。

## 使用

```bash
# npm
npm create vita-admin@latest my-app

# 或 yarn
yarn create vita-admin my-app

# 或 npx
npx create-vita-admin my-app
```

然后：

```bash
cd my-app
yarn          # 安装依赖
yarn start    # 启动开发服务器（默认 3003，portfinder 自动顺延）
```

> 启动前在 `.env/.env.dev` 配好 `API_PROXY`（后端代理）与登录加密密钥（`CRYPTO_KEY` / `RSA_PUB_KEY`）。

## 生成的项目包含

- **框架**：React 18 + TypeScript + MobX + webpack 5
- **UI**：主要基于 `@hsu-react/ui`（Panel / Form / Table / Search / FormItem / Operate / Chart …），底层 Ant Design 5
- **能力**：动态路由（后端菜单驱动）、权限控制、多标签页、主题切换、国际化、Axios 服务层、
  MobX store 基类（列表 / 表单 / CRUD）
- **页面脚手架**：`yarn crt:lp` / `crt:fp` / `crt:lfp` / `crt:lmp` / `crt:dp` 一键生成各类页面
- **项目级 Claude skills**（`.claude/skills/`）：`page-creation` / `api-creation` /
  `options-management` / `menu-function-management` / `playwright-mcp-strategy` ——
  用 Claude Code 开发时自动遵循本框架的页面 / 接口 / 选项 / 菜单规范

## 与模板仓库的关系

模板取自 [vita-admin-starter](https://github.com/VitaTsui/vita-admin-starter)。
脚手架内嵌该模板的快照；模板更新后会发布 `create-vita-admin` 的新版本。

## License

MIT
