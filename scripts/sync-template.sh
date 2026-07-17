#!/usr/bin/env bash
# Sync the embedded template + project-level skills from the vita-admin-starter source repo.
# Usage:
#   bash scripts/sync-template.sh [path-to-vita-admin-starter]
# Defaults to the sibling directory ../vita-admin-starter; pass a path to override.
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
# Template body: exclude build artifacts / git / local config (.claude is handled separately — only skills are taken)
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

# .gitignore → _gitignore (npm treats dot-gitignore files specially at publish time, so rename it as a placeholder)
if [ -f "$DST/.gitignore" ]; then
  mv -f "$DST/.gitignore" "$DST/_gitignore"
fi

# Project-level skills: copy only .claude/skills (excluding local settings and other config)
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
