# Debug Session: vexrune-msa-page-error

**Status:** [OPEN]
**Symptom:** 用户访问 `https://vexrune.top/product/msa` 时页面无法打开，浏览器 Network 面板显示 `main.b90395f8.css`、`main.551a3dee.js`、`favicon.svg` 三个资源返回 404（红色 X）。
**Environment:** 部署链路 = GitHub Actions → ECS (Nginx)。OSS 那条线已排除。
**Reproduction:**
1. 浏览器打开 `https://vexrune.top/product/msa`
2. DevTools → Network：所有静态资源 404，React 根组件不挂载，页面空白。

## Runtime Evidence（采集于 2026-07-21）

`Invoke-WebRequest https://vexrune.top/product/msa`:
- HTTP/1.1 200 OK
- Server: nginx
- Content-Type: text/html; charset=utf-8
- Body 是 SPA 的 index.html，但其中链接是**相对路径**：
  - `<link href="./static/css/main.b90395f8.css" ...>`
  - `<script src="./static/js/main.551a3dee.js" ...>`
  - `<link rel="icon" href="./favicon.svg" ...>`

浏览器在 `/product/msa` 页面上把这些相对路径解析为：
- `https://vexrune.top/product/favicon.svg` → 404
- `https://vexrune.top/product/static/...` → 404

## Hypotheses（运行时证据已证伪/证实）

| # | Hypothesis | Evidence | Status |
|---|---|---|---|
| H1 | `/product/msa` 路由不存在 | 该 URL 返回 200 并返回 SPA index.html | REJECTED |
| H2 | 静态资源被打包/上传丢失 | `/static/...` 在根目录下原本就存在（被 nginx 命中），但深路径下被相对路径解析到 `/product/static/...` 而无此文件 | REJECTED（资源在，只是路径错） |
| H3 | Nginx 没配 try_files | `try_files` 已生效，深路径能命中 index.html | REJECTED |
| H4 | package.json 中 `homepage: "."` 让产物全部使用相对路径，深路径 100% 404 | 构建产物确认所有静态资源 link/script 是 `./xxx` | **CONFIRMED** |

## Root Cause

`package.json` 含 `"homepage": "."`，CRA 在打包期把所有 `%PUBLIC_URL%` 替换成 `.`，产物变成相对路径。SPA 任何非 `/` 的深路径都会让 `./static/*` 与 `./favicon.svg` 解析失败 → JS/CSS 加载失败 → React 不挂载 → 看上去"打不开"。

## Fix Plan（最小改动）

1. 修改 `package.json` 的 `homepage` 为 `"/"`。
2. `npm run build`。
3. 用 `deploy-ecs.yml` 流程把 `build/` 重新发布到 `/app/vex-main/`。

## Post-fix Verification Plan

- `curl https://vexrune.top/product/msa` 返回的 HTML 中，`<link href>` 与 `<script src>` 必须是 **绝对路径**（以 `/static/...`、`/favicon.svg` 开头）。
- 在浏览器打开 `https://vexrune.top/product/msa` 与 `https://vexrune.top/about` 两个深路径，Network 中 0 个红色 X，React 内容正常渲染。
