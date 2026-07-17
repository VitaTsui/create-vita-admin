const path = require("path");
const fs = require("fs");

/**
 * Read a template file and replace its placeholders
 * @param {string} templatePath - Template file path
 * @param {Object} replacements - Replacement mapping object
 * @returns {string} The content after replacement
 */
function readAndReplaceTemplate(templatePath, replacements) {
  try {
    let content = fs.readFileSync(templatePath, "utf8");

    // Remove the template string markers
    content = content
      .replace(/^`\s*/, "")
      .replace(/\s*`;\s*$/, "")
      .trim();

    // Perform the replacements
    Object.keys(replacements).forEach((key) => {
      const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
      content = content.replace(regex, replacements[key]);
    });

    return content;
  } catch (error) {
    console.error(`读取模板文件失败: ${templatePath}`, error);
    throw error;
  }
}

/**
 * Ensure a directory exists
 * @param {string} dirPath - Directory path
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Write a file
 * @param {string} filePath - File path
 * @param {string} content - File content
 */
function writeFile(filePath, content) {
  try {
    ensureDirectoryExists(path.dirname(filePath));
    const fileSave = require("file-save");
    fileSave(filePath).write(content, "utf-8").end("\n");
    console.log(`✓ 创建文件: ${filePath}`);
  } catch (error) {
    console.error(`✗ 创建文件失败: ${filePath}`, error);
    throw error;
  }
}

/**
 * Validate required arguments
 * @param {string} panelName - Panel name
 */
function validatePanelName(panelName) {
  if (!panelName) {
    console.error("错误: 请提供面板名称");
    process.exit(1);
  }

  // Validate the name format (only letters, digits, underscores and hyphens are allowed)
  if (!/^[a-zA-Z0-9_-]+$/.test(panelName)) {
    console.error("错误: 面板名称只能包含字母、数字、下划线和连字符");
    process.exit(1);
  }
}

/**
 * Build the API path
 * @param {string} parent - Parent path
 * @param {string} apiName - API name
 * @returns {string} The API path
 */
function buildApiPath(parent, apiName) {
  return parent ? `${parent}/${apiName}` : apiName;
}

/**
 * Build the permission prefix
 * @param {string} apiUrl - API URL
 * @returns {string} The permission prefix
 */
function buildPermiPrefix(apiUrl) {
  if (!apiUrl) return "";
  return apiUrl.split("/").filter(Boolean).join(":");
}

module.exports = {
  readAndReplaceTemplate,
  ensureDirectoryExists,
  writeFile,
  validatePanelName,
  buildApiPath,
  buildPermiPrefix,
};
