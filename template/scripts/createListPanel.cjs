const path = require("path");
const uppercamelcase = require("uppercamelcase");
const {
  readAndReplaceTemplate,
  writeFile,
  validatePanelName,
  buildApiPath,
  buildPermiPrefix,
} = require("./utils.cjs");

/**
 * Create a list panel (without a form)
 * Usage: node createListPanel.cjs <panelName> [parent] [apiUrl]
 * Example: node createListPanel.cjs userManagement dataMonitoring /vm/user
 */
function main() {
  try {
    const panelName = process.argv[2];
    validatePanelName(panelName);

    const PanelName = uppercamelcase(panelName);
    const parent = process.argv[3] || "";
    const apiUrl = process.argv[4] || "";

    const panelPath = path.resolve(
      __dirname,
      "../src/pages",
      parent,
      PanelName
    );
    const apiName = PanelName.toLowerCase();
    const apiPath = path.resolve(__dirname, "../src/services/apis", parent);
    const apiPathValue = buildApiPath(parent, apiName);
    const permiPrefix = buildPermiPrefix(apiUrl);

    console.log(`\n开始创建列表面板: ${PanelName}`);
    console.log(`面板路径: ${panelPath}`);
    console.log(`API 路径: ${apiPathValue}\n`);

    // Read and process the templates
    const panelTemplate = path.resolve(__dirname, "./ListPanel/panel.js");
    const storeTemplate = path.resolve(__dirname, "./ListPanel/store.js");
    const apiTemplate = path.resolve(__dirname, "./ListPanel/api.js");

    const Panel = readAndReplaceTemplate(panelTemplate, {
      "<NAME>": PanelName,
      "<QUERY_PERMI>": permiPrefix ? `"${permiPrefix}:query"` : "",
    });

    const Store = readAndReplaceTemplate(storeTemplate, {
      "<NAME>": PanelName,
      "<API_PATH>": apiPathValue,
    });

    const Api = readAndReplaceTemplate(apiTemplate, {
      "<NAME>": PanelName,
      "<API_PAGE_PATH>": apiUrl ? `${apiUrl}/page` : "",
      "<API_INFO_PATH>": apiUrl ? `${apiUrl}/info/` : "",
      "<API_ADD_PATH>": apiUrl ? `${apiUrl}/add` : "",
      "<API_UPD_PATH>": apiUrl ? `${apiUrl}/upd` : "",
      "<API_DEL_PATH>": apiUrl ? `${apiUrl}/del` : "",
    });

    // Create the files
    const files = [
      {
        fileName: "index.tsx",
        content: Panel,
        path: panelPath,
      },
      {
        fileName: `${PanelName}Store.ts`,
        content: Store,
        path: panelPath,
      },
      {
        fileName: "index.module.scss",
        content: `.${PanelName} {\n}`,
        path: panelPath,
      },
      {
        fileName: `${apiName}.ts`,
        content: Api,
        path: apiPath,
      },
    ];

    files.forEach((file) => {
      writeFile(path.join(file.path, file.fileName), file.content);
    });

    console.log(`\n✓ 成功创建列表面板: ${PanelName}\n`);
  } catch (error) {
    console.error("\n✗ 创建列表面板失败:", error.message);
    process.exit(1);
  }
}

main();
