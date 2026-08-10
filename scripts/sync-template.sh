#!/usr/bin/env bash
# 从 vita-admin-starter 系列仓库同步内嵌模板。
#
# 用法：
#   bash scripts/sync-template.sh              # 同步全部模板
#   bash scripts/sync-template.sh vite         # 只同步某一个
#   STARTER_V2=/path/to/repo bash scripts/sync-template.sh
#
# 每个模板对应「某个仓库的某个 ref」。这里用 `git archive` 导出，而不是 rsync 工作区：
# 三个模板来自同一个 clone 的不同分支，rsync 就得来回 checkout，既慢又会弄脏你手上的
# 工作区（未提交的改动会被卷进模板）。git archive 直接从 ref 出内容，与工作区无关。
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"

# 模板源：<模板名>|<仓库路径>|<git ref>
STARTER_V2="${STARTER_V2:-$REPO_DIR/../vita-admin-starter}"
STARTER_V1="${STARTER_V1:-$REPO_DIR/../vita-admin-starter}"

TEMPLATES=(
  "vite|$STARTER_V2|feat/vite"
  "webpack|$STARTER_V2|feat/hsu-ui-v2"
  "antd5|$STARTER_V1|develop"
)

WANTED="${1:-}"

sync_one() {
  local name="$1" src="$2" ref="$3"
  local dst="$REPO_DIR/templates/$name"

  if [ ! -d "$src/.git" ]; then
    echo "✗ 找不到源仓库：$src" >&2
    echo "  用 STARTER_V2=/path/to/vita-admin-starter 指定" >&2
    exit 1
  fi
  if ! git -C "$src" rev-parse --verify --quiet "$ref" >/dev/null; then
    echo "✗ 仓库 $src 里没有 ref：$ref" >&2
    exit 1
  fi

  echo "→ [$name] $src @ $ref"
  rm -rf "$dst"
  mkdir -p "$dst"
  # 排除项与 .npmignore 语义无关，纯粹是「不该进模板」的东西
  git -C "$src" archive "$ref" | tar -x -C "$dst" \
    --exclude='node_modules' \
    --exclude='dist' \
    --exclude='tmp' \
    --exclude='playwright' \
    --exclude='*.log' \
    --exclude='.DS_Store'

  # .claude 下只保留 skills：settings 是本机的，不该跟着模板走
  if [ -d "$dst/.claude" ]; then
    find "$dst/.claude" -mindepth 1 -maxdepth 1 ! -name skills -exec rm -rf {} +
    [ -d "$dst/.claude/skills" ] || rm -rf "$dst/.claude"
  fi

  # .gitignore → _gitignore：npm 发包时会把 .gitignore 特殊对待（改名/丢弃），
  # 所以模板里存成占位名，由 index.js 在生成项目时改回来
  if [ -f "$dst/.gitignore" ]; then
    mv -f "$dst/.gitignore" "$dst/_gitignore"
  fi

  local files
  files=$(find "$dst" -type f | wc -l | tr -d ' ')
  echo "  ✓ $files 个文件"
}

matched=0
for entry in "${TEMPLATES[@]}"; do
  IFS='|' read -r name src ref <<< "$entry"
  if [ -z "$WANTED" ] || [ "$WANTED" = "$name" ]; then
    sync_one "$name" "$src" "$ref"
    matched=1
  fi
done

if [ "$matched" = "0" ]; then
  echo "✗ 未知模板：$WANTED" >&2
  echo "  可用：$(printf '%s ' "${TEMPLATES[@]%%|*}")" >&2
  exit 1
fi

# 抽公共文件。必须在同步之后跑：三个模板同源，字体/图片这类二进制资产完全一样，
# 各存一份会让这个「每次 npm create 都要下载」的包体积乘三。
node "$SCRIPT_DIR/dedupe-templates.cjs"

echo ""
echo "下一步（发布新版本）："
echo "  npm version patch"
echo "  npm publish --otp=<你的6位验证码>"
echo "  git push --follow-tags"
