#!/usr/bin/env bash
# 从 vita-admin-starter 源仓库同步内嵌模板 + 项目级 skills。
# 用法：
#   bash scripts/sync-template.sh [vita-admin-starter 路径]
# 默认取兄弟目录 ../vita-admin-starter，可传参覆盖。
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
SRC="${1:-$REPO_DIR/../vita-admin-starter}"
DST="$REPO_DIR/template"

if [ ! -d "$SRC/src" ]; then
  echo "✗ 找不到 vita-admin-starter 源码：$SRC" >&2
  echo "  用法：bash scripts/sync-template.sh /path/to/vita-admin-starter" >&2
  exit 1
fi

echo "→ 同步模板：$SRC  →  $DST"
# 模板主体：排除产物/git/本地配置（.claude 单独处理，只取 skills）
rsync -a --delete \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  --exclude='.claude' \
  --exclude='tmp' \
  --exclude='playwright' \
  --exclude='*.log' \
  --exclude='*.tar.gz' \
  --exclude='.DS_Store' \
  "$SRC/" "$DST/"

# .gitignore → _gitignore（npm 发布会特殊处理点 gitignore，故重命名占位）
if [ -f "$DST/.gitignore" ]; then
  mv -f "$DST/.gitignore" "$DST/_gitignore"
fi

# 项目级 skills：只取 .claude/skills（不含本地 settings 等配置）
if [ -d "$SRC/.claude/skills" ]; then
  mkdir -p "$DST/.claude/skills"
  rsync -a --delete "$SRC/.claude/skills/" "$DST/.claude/skills/"
fi

FILES=$(find "$DST" -type f | wc -l | tr -d ' ')
echo "✓ 同步完成，模板共 $FILES 个文件。"
echo ""
echo "下一步（发布新版本）："
echo "  npm version patch"
echo "  npm publish --otp=<你的6位验证码>"
echo "  git push --follow-tags"
