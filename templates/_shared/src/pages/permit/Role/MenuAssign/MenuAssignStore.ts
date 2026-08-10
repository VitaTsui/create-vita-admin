import React from "react";
import {
  MenuListData,
  RoleRtRsco,
  getPermRtRscoTreeNode,
  updateRoleRtRsco,
} from "@/services/apis/permit/Role/role";
import { computed, makeObservable, observable } from "mobx";

import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { ResType } from "@/services/Axios";
import { TreeData, CheckedKeys } from "@hsu-react/ui";

/** Summary of granted function permissions under a menu node (including submenus) */
export interface MenuGrantInfo {
  checked: number;
  total: number;
}

/** Resource type: 1 menu, 2 function (consistent with backend sys_rsco.type) */
const RSCO_TYPE_MENU = 1;
const RSCO_TYPE_FUNCTION = 2;

class MenuAssignStore extends FormModalStore<RoleRtRsco> {
  @computed
  get menuTree() {
    return this._menuTree;
  }

  @computed
  get functionTree() {
    // Show the function tree based on the clicked menu; return empty if no menu is clicked
    if (!this._selectedMenuKey) {
      return [];
    }
    return this._getFilteredFunctionTreeBySingleMenu(this._selectedMenuKey);
  }

  @computed
  get selectedMenuKey() {
    return this._selectedMenuKey;
  }

  /** Full path of the currently selected menu (e.g. "System Management / Role Management"), used as the right panel title */
  @computed
  get selectedMenuPath() {
    if (!this._selectedMenuKey) return "";

    const findPath = (
      items: MenuListData[],
      targetKey: string,
      trail: string[]
    ): string[] | null => {
      for (const item of items ?? []) {
        if (!item.id || this._getItemType(item.type) !== RSCO_TYPE_MENU) {
          continue;
        }
        const next = [...trail, item.nm ?? ""];
        if (item.id.toString() === targetKey) return next;
        if (item.children) {
          const found = findPath(item.children, targetKey, next);
          if (found) return found;
        }
      }
      return null;
    };

    const path = findPath(this._allMenuListData, this._selectedMenuKey, []);
    return path ? path.join(" / ") : "";
  }

  /** Summary of selected permissions (same basis as submission: menus include half-checked, functions are the union of each menu's staged checks) */
  @computed
  get grantSummary() {
    const menuCount = this._getKeysArray(this._menuCheckedKeys).length;
    const functionKeys = new Set<string>();
    this._menuFunctionCheckedMap?.forEach((checkedKeys) => {
      this._getKeysArray(checkedKeys)?.forEach((key) => functionKeys.add(key));
    });
    return { menuCount, functionCount: functionKeys.size };
  }

  @observable
  private accessor _selectedMenuKey: string | null = null;

  // Store the checked functions of each menu (for staging)
  @observable
  private accessor _menuFunctionCheckedMap: Map<string, CheckedKeys> =
    new Map();

  @observable
  private accessor _menuTree: TreeData[] = [];

  @observable
  private accessor _allFunctionTree: TreeData[] = [];

  @observable
  private accessor _allMenuListData: MenuListData[] = [];

  @computed
  get menuCheckedKeys() {
    return this._menuCheckedKeys;
  }

  @computed
  get functionCheckedKeys() {
    // If a menu is selected, return its staged function-check state
    if (this._selectedMenuKey) {
      const savedKeys = this._menuFunctionCheckedMap.get(this._selectedMenuKey);
      return savedKeys || [];
    }
    return this._functionCheckedKeys;
  }

  @observable
  private accessor _menuCheckedKeys: CheckedKeys = [];

  @observable
  private accessor _functionCheckedKeys: CheckedKeys = [];

  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * Get the type value (compatible with both strings and numbers)
   */
  private _getItemType = (type: string | number | undefined): number => {
    return typeof type === "string" ? Number(type) : type ?? 0;
  };

  /**
   * Convert CheckedKeys to a string array
   */
  private _getKeysArray = (checkedKeys: CheckedKeys): string[] => {
    if (Array.isArray(checkedKeys)) {
      return checkedKeys?.map((key) => key.toString());
    }
    const { checked, halfChecked } = checkedKeys as {
      checked: React.Key[];
      halfChecked: React.Key[];
    };
    return [...checked, ...halfChecked]?.map((key) => key.toString());
  };

  /**
   * Fetch the menus associated with the role
   */
  public getPermRtRscoTreeNode = (id: number | string) => {
    getPermRtRscoTreeNode({ subId: id }).then((res) => {
      if (res.code === 0) {
        const { checkedKeys, list } = res.data;

        this._formData = { rscoIdList: checkedKeys?.map((i) => i.toString()) };
        this._allMenuListData = list;

        const { menuTree, functionTree } = this._separateTreeByType(list);
        this._menuTree = menuTree;
        this._allFunctionTree = functionTree;

        this._setInitialCheckedKeys(
          list,
          checkedKeys?.map((i) => i.toString())
        );

        // On open, auto-locate the first menu that has functions so the right side is never blank
        const firstKey = this._firstMenuKeyWithFunctions(list);
        this._selectedMenuKey = firstKey;
        this._functionCheckedKeys = firstKey
          ? this._menuFunctionCheckedMap.get(firstKey) || []
          : [];
      } else {
        this._message(res);
      }
    });
  };

  /**
   * Split the menu tree and function tree by type
   */
  private _separateTreeByType = (list: MenuListData[]) => {
    const formatMenuTree = (items: MenuListData[]): TreeData[] => {
      const nodes: TreeData[] = [];

      items?.forEach((item) => {
        if (
          this._getItemType(item.type) === RSCO_TYPE_MENU &&
          item.nm &&
          item.id
        ) {
          const children = item.children
            ? formatMenuTree(item.children)
            : undefined;

          nodes.push({
            title: item.nm,
            key: item.id.toString(),
            value: item.id.toString(),
            children: children && children.length > 0 ? children : undefined,
          });
        }
      });

      return nodes;
    };

    const collectFunctionNodes = (items: MenuListData[]): TreeData[] => {
      const nodes: TreeData[] = [];

      items?.forEach((item) => {
        if (
          this._getItemType(item.type) === RSCO_TYPE_FUNCTION &&
          item.nm &&
          item.id
        ) {
          nodes.push({
            title: item.nm,
            key: item.id.toString(),
            value: item.id.toString(),
            checkable: true,
            children:
              item.children && item.children.length > 0
                ? collectFunctionNodes(item.children)
                : undefined,
          });
        } else if (item.children) {
          nodes.push(...collectFunctionNodes(item.children));
        }
      });

      return nodes;
    };

    return {
      menuTree: formatMenuTree(list),
      functionTree: collectFunctionNodes(list),
    };
  };

  /**
   * Set the initial checked state (supports multi-level function permissions)
   */
  private _setInitialCheckedKeys = (
    list: MenuListData[],
    checkedKeys: string[]
  ) => {
    const menuKeys: string[] = [];
    const functionKeysByMenu = new Map<string, string[]>();

    const collectKeys = (items: MenuListData[], parentMenuId?: string) => {
      items?.forEach((item) => {
        if (!item.id) return;

        const itemId = item.id.toString();
        const itemType = this._getItemType(item.type);
        const isMenu = itemType === RSCO_TYPE_MENU;
        const isFunction = itemType === RSCO_TYPE_FUNCTION;

        if (checkedKeys.includes(itemId)) {
          if (isMenu) {
            menuKeys.push(itemId);
          } else if (isFunction && parentMenuId) {
            if (!functionKeysByMenu.has(parentMenuId)) {
              functionKeysByMenu.set(parentMenuId, []);
            }
            functionKeysByMenu.get(parentMenuId)!.push(itemId);
          }
        }

        const currentMenuId = isMenu ? itemId : parentMenuId;
        if (item.children) {
          collectKeys(item.children, currentMenuId);
        }
      });
    };

    collectKeys(list);

    this._menuCheckedKeys = menuKeys;
    functionKeysByMenu?.forEach((keys, menuId) => {
      this._menuFunctionCheckedMap.set(menuId, keys);
    });
  };

  /**
   * The first menu that directly holds functions (depth-first); falls back to the first menu if none
   */
  private _firstMenuKeyWithFunctions = (
    list: MenuListData[]
  ): string | null => {
    let firstMenuKey: string | null = null;

    const dfs = (items: MenuListData[]): string | null => {
      for (const item of items ?? []) {
        if (!item.id) continue;
        if (this._getItemType(item.type) === RSCO_TYPE_MENU) {
          const itemId = item.id.toString();
          if (!firstMenuKey) firstMenuKey = itemId;
          const hasFunction = (item.children || []).some(
            (child) =>
              this._getItemType(child.type) === RSCO_TYPE_FUNCTION &&
              child.nm &&
              child.id
          );
          if (hasFunction) return itemId;
          if (item.children) {
            const found = dfs(item.children);
            if (found) return found;
          }
        }
      }
      return null;
    };

    return dfs(list) ?? firstMenuKey;
  };

  /**
   * Recursively extract function nodes and their sub-functions (functions nested inside a function's children are shown too)
   */
  private _extractFunctionWithChildren = (item: MenuListData): TreeData => {
    const children =
      item.children && item.children.length > 0
        ? item.children
            .filter(
              (child) =>
                this._getItemType(child.type) === RSCO_TYPE_FUNCTION &&
                child.nm &&
                child.id
            )
            .map((child) => this._extractFunctionWithChildren(child))
        : undefined;
    return {
      title: item.nm!,
      key: item.id!.toString(),
      value: item.id!.toString(),
      checkable: true,
      children: children && children.length > 0 ? children : undefined,
    };
  };

  /**
   * Filter the function tree by the selected menu (only the menu's direct children; a function's own children are shown recursively)
   */
  private _getFilteredFunctionTreeBySingleMenu = (
    menuKey: string
  ): TreeData[] => {
    const findMenuAndExtractDirectFunctions = (
      items: MenuListData[],
      targetKey: string
    ): TreeData[] => {
      for (const item of items ?? []) {
        if (!item.id) continue;
        const itemId = item.id.toString();
        if (
          this._getItemType(item.type) === RSCO_TYPE_MENU &&
          itemId === targetKey &&
          item.children
        ) {
          // Only take function nodes among the menu's direct children; a function's own sub-functions are shown recursively
          return (item.children || [])
            .filter(
              (child) =>
                this._getItemType(child.type) === RSCO_TYPE_FUNCTION &&
                child.nm &&
                child.id
            )
            .map((child) => this._extractFunctionWithChildren(child));
        }
        if (item.children) {
          const found = findMenuAndExtractDirectFunctions(
            item.children,
            targetKey
          );
          if (found.length > 0) return found;
        }
      }
      return [];
    };

    return findMenuAndExtractDirectFunctions(this._allMenuListData, menuKey);
  };

  /**
   * Recursively collect a function node's own id and its sub-function ids
   */
  private _collectFunctionKeyIdsFromFunctionNode = (
    node: MenuListData
  ): string[] => {
    if (!node.id || this._getItemType(node.type) !== RSCO_TYPE_FUNCTION)
      return [];
    const id = node.id.toString();
    const fromChildren = (node.children || []).flatMap((c) =>
      this._collectFunctionKeyIdsFromFunctionNode(c)
    );
    return [id, ...fromChildren];
  };

  /**
   * All function ids directly mounted on a menu (including a function's sub-functions, excluding functions under submenus)
   */
  private _directFunctionKeysOfMenu = (menuNode: MenuListData): string[] => {
    return (menuNode.children || []).flatMap((child) =>
      this._getItemType(child.type) === RSCO_TYPE_FUNCTION
        ? this._collectFunctionKeyIdsFromFunctionNode(child)
        : []
    );
  };

  /**
   * All function ids in a menu's subtree (including functions under submenus)
   */
  private _allFunctionKeysUnderMenu = (menuNode: MenuListData): string[] => {
    return (menuNode.children || []).flatMap((child) => {
      const t = this._getItemType(child.type);
      if (t === RSCO_TYPE_FUNCTION) {
        return this._collectFunctionKeyIdsFromFunctionNode(child);
      }
      if (t === RSCO_TYPE_MENU) {
        return this._allFunctionKeysUnderMenu(child);
      }
      return [];
    });
  };

  private _findMenuNode = (
    items: MenuListData[],
    targetKey: string
  ): MenuListData | null => {
    for (const item of items ?? []) {
      if (!item.id) continue;
      if (
        item.id.toString() === targetKey &&
        this._getItemType(item.type) === RSCO_TYPE_MENU
      ) {
        return item;
      }
      if (item.children) {
        const found = this._findMenuNode(item.children, targetKey);
        if (found) return found;
      }
    }
    return null;
  };

  /** Ids of a menu and its submenus (used to merge staged function checks under each menu) */
  private _menuIdsInSubtree = (menuNode: MenuListData): string[] => {
    if (!menuNode.id) return [];
    const id = menuNode.id.toString();
    const childMenuIds = (menuNode.children || [])
      .filter((c) => c.id && this._getItemType(c.type) === RSCO_TYPE_MENU)
      .flatMap((c) => this._menuIdsInSubtree(c));
    return [id, ...childMenuIds];
  };

  /**
   * For menu tree node display: granted / total function permissions within the menu's subtree
   */
  public getMenuGrantInfo = (menuKey: string): MenuGrantInfo => {
    const menuNode = this._findMenuNode(this._allMenuListData, menuKey);
    if (!menuNode) return { checked: 0, total: 0 };

    const allFuncKeys = this._allFunctionKeysUnderMenu(menuNode);
    const uniqueAll = [...new Set(allFuncKeys)];
    if (uniqueAll.length === 0) return { checked: 0, total: 0 };

    const menuIds = this._menuIdsInSubtree(menuNode);
    const checkedSet = new Set<string>();
    for (const mid of menuIds) {
      const ck = this._menuFunctionCheckedMap.get(mid);
      if (ck === undefined) continue;
      for (const k of this._getKeysArray(ck)) {
        checkedSet.add(k);
      }
    }

    let checkedCount = 0;
    for (const k of uniqueAll) {
      if (checkedSet.has(k)) checkedCount++;
    }

    return { checked: checkedCount, total: uniqueAll.length };
  };

  /**
   * Set the menu checked state.
   * Linkage: a newly checked menu auto-grants all its functions; an unchecked menu also clears its functions.
   */
  public setMenuCheckedKeys = (checkedKeys: CheckedKeys) => {
    const prevEffective = new Set(this._getKeysArray(this._menuCheckedKeys));
    const nextEffective = new Set(this._getKeysArray(checkedKeys));
    // Auto-grant only applies to fully-checked menus; half-checked ones (caused by submenus) do not auto-grant functions
    const nextChecked = new Set(
      (Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked)?.map(
        (key) => key.toString()
      )
    );

    nextChecked.forEach((key) => {
      if (prevEffective.has(key)) return;
      const menuNode = this._findMenuNode(this._allMenuListData, key);
      if (!menuNode) return;
      const funcKeys = this._directFunctionKeysOfMenu(menuNode);
      if (funcKeys.length > 0) {
        this._menuFunctionCheckedMap.set(key, funcKeys);
      }
    });

    prevEffective.forEach((key) => {
      if (nextEffective.has(key)) return;
      this._menuFunctionCheckedMap.delete(key);
    });

    this._menuCheckedKeys = checkedKeys;

    // Sync the function-check display of the currently selected menu
    if (this._selectedMenuKey) {
      this._functionCheckedKeys =
        this._menuFunctionCheckedMap.get(this._selectedMenuKey) || [];
    }
  };

  /** Ensure the menu is in the checked set (auto-added when a function is checked but its menu is not) */
  private _ensureMenuChecked = (menuKey: string) => {
    const effective = this._getKeysArray(this._menuCheckedKeys);
    if (effective.includes(menuKey)) return;

    if (Array.isArray(this._menuCheckedKeys)) {
      this._menuCheckedKeys = [...this._menuCheckedKeys, menuKey];
    } else {
      const { checked, halfChecked } = this._menuCheckedKeys as {
        checked: React.Key[];
        halfChecked: React.Key[];
      };
      this._menuCheckedKeys = {
        checked: [...checked, menuKey],
        halfChecked,
      };
    }
  };

  /**
   * Set the function checked state.
   * Linkage: checking a function auto-checks its parent menu, avoiding the invalid "function without menu" configuration.
   */
  public setFunctionCheckedKeys = (checkedKeys: CheckedKeys) => {
    this._functionCheckedKeys = checkedKeys;
    // Also update the staged state
    if (this._selectedMenuKey) {
      this._menuFunctionCheckedMap.set(this._selectedMenuKey, checkedKeys);

      if (this._getKeysArray(checkedKeys).length > 0) {
        this._ensureMenuChecked(this._selectedMenuKey);
      }
    }
  };

  /**
   * Set the clicked menu (used to display its functions)
   */
  public setSelectedMenuKey = (menuKey: string | null) => {
    // Save the function-check state of the current menu
    if (this._selectedMenuKey) {
      this._menuFunctionCheckedMap.set(
        this._selectedMenuKey,
        this._functionCheckedKeys
      );
    }

    this._selectedMenuKey = menuKey;
    this._functionCheckedKeys = menuKey
      ? this._menuFunctionCheckedMap.get(menuKey) || []
      : [];
  };

  /** Grant all menus and functions in one click */
  public checkAllPermissions = () => {
    const allMenuKeys: string[] = [];

    const dfs = (items: MenuListData[]) => {
      items?.forEach((item) => {
        if (!item.id) return;
        if (this._getItemType(item.type) === RSCO_TYPE_MENU) {
          const itemId = item.id.toString();
          allMenuKeys.push(itemId);
          const funcKeys = this._directFunctionKeysOfMenu(item);
          if (funcKeys.length > 0) {
            this._menuFunctionCheckedMap.set(itemId, funcKeys);
          }
          if (item.children) dfs(item.children);
        }
      });
    };

    dfs(this._allMenuListData);

    this._menuCheckedKeys = allMenuKeys;
    if (this._selectedMenuKey) {
      this._functionCheckedKeys =
        this._menuFunctionCheckedMap.get(this._selectedMenuKey) || [];
    }
  };

  /** Clear all selected permissions in one click */
  public clearAllPermissions = () => {
    this._menuCheckedKeys = [];
    this._functionCheckedKeys = [];
    this._menuFunctionCheckedMap.clear();
  };

  /**
   * Reset the checked state
   */
  public resetCheckedKeys = () => {
    this._menuCheckedKeys = [];
    this._functionCheckedKeys = [];
    this._selectedMenuKey = null;
    this._menuFunctionCheckedMap.clear();
  };

  /**
   * Get the merged list of checked items
   */
  public getMergedCheckedKeys = (): string[] => {
    // Save the function-check state of the current menu
    if (this._selectedMenuKey) {
      this._menuFunctionCheckedMap.set(
        this._selectedMenuKey,
        this._functionCheckedKeys
      );
    }

    const menuKeys = this._getKeysArray(this._menuCheckedKeys);
    const allFunctionKeys = new Set<string>();

    this._menuFunctionCheckedMap?.forEach((checkedKeys) => {
      this._getKeysArray(checkedKeys)?.forEach((key) =>
        allFunctionKeys.add(key)
      );
    });

    return [...menuKeys, ...Array.from(allFunctionKeys)];
  };

  /**
   * Edit the associated menus
   * @param id
   * @param data
   * @param fn
   */
  public updateRoleRtRsco = (
    id: number | string,
    data: RoleRtRsco,
    fn?: (res: ResType) => void
  ) => {
    updateRoleRtRsco({ id, ...data }).then((res) => {
      if (res.code === 0) {
        fn?.(res);
      }

      this._message(res);
    });
  };
}

export default new MenuAssignStore();
