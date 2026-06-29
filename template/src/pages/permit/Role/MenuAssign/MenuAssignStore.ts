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

/** 菜单节点下（含子菜单）功能权限授权数量汇总 */
export interface MenuGrantInfo {
  checked: number;
  total: number;
}

/** 资源类型：1 菜单，2 功能（与后端 sys_rsco.type 一致） */
const RSCO_TYPE_MENU = 1;
const RSCO_TYPE_FUNCTION = 2;

class MenuAssignStore extends FormModalStore<RoleRtRsco> {
  @computed
  get menuTree() {
    return this._menuTree;
  }

  @computed
  get functionTree() {
    // 根据点击选中的菜单显示功能树，如果没有点击菜单则返回空
    if (!this._selectedMenuKey) {
      return [];
    }
    return this._getFilteredFunctionTreeBySingleMenu(this._selectedMenuKey);
  }

  @computed
  get selectedMenuKey() {
    return this._selectedMenuKey;
  }

  /** 当前选中菜单的完整路径（如「系统管理 / 角色管理」），用于右侧面板标题 */
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

  /** 已选权限汇总（口径与提交一致：菜单含半选，功能为各菜单暂存的并集） */
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

  // 存储每个菜单对应的已勾选功能（用于暂存）
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
    // 如果有选中的菜单，返回该菜单暂存的功能勾选状态
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
   * 获取类型值（兼容字符串和数字）
   */
  private _getItemType = (type: string | number | undefined): number => {
    return typeof type === "string" ? Number(type) : type ?? 0;
  };

  /**
   * 将 CheckedKeys 转换为字符串数组
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
   * 获取角色关联菜单
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

        // 打开即自动定位到第一个有功能的菜单，右侧不再空白
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
   * 根据 type 分离菜单和功能树
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
   * 设置初始选中状态（支持功能权限多层）
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
   * 第一个直接挂有功能的菜单（深度优先），没有则回退到第一个菜单
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
   * 递归提取功能节点及其子功能（功能自身的子项里有功能也都要显示）
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
   * 根据选中的菜单过滤功能树（仅取菜单的直接子项，功能自身的子项递归显示）
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
          // 只取菜单的直接子项中的功能节点，功能自身的子功能递归显示
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
   * 从功能节点递归收集其自身及子功能 id
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
   * 某菜单直接挂载的全部功能 id（含功能的子功能，不含子菜单下的功能）
   */
  private _directFunctionKeysOfMenu = (menuNode: MenuListData): string[] => {
    return (menuNode.children || []).flatMap((child) =>
      this._getItemType(child.type) === RSCO_TYPE_FUNCTION
        ? this._collectFunctionKeyIdsFromFunctionNode(child)
        : []
    );
  };

  /**
   * 某菜单子树下全部功能 id（含子菜单下的功能）
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

  /** 菜单及其子菜单 id（用于合并各菜单下暂存的功能勾选） */
  private _menuIdsInSubtree = (menuNode: MenuListData): string[] => {
    if (!menuNode.id) return [];
    const id = menuNode.id.toString();
    const childMenuIds = (menuNode.children || [])
      .filter((c) => c.id && this._getItemType(c.type) === RSCO_TYPE_MENU)
      .flatMap((c) => this._menuIdsInSubtree(c));
    return [id, ...childMenuIds];
  };

  /**
   * 菜单树节点展示用：该菜单子树内功能权限已授权数 / 总数
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
   * 设置菜单选中状态。
   * 联动：新勾选的菜单自动授权其全部功能，取消勾选的菜单同时清空其功能。
   */
  public setMenuCheckedKeys = (checkedKeys: CheckedKeys) => {
    const prevEffective = new Set(this._getKeysArray(this._menuCheckedKeys));
    const nextEffective = new Set(this._getKeysArray(checkedKeys));
    // 自动授权只针对「完全勾选」的菜单；半选（因子菜单连带）不自动授权功能
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

    // 同步当前选中菜单的功能勾选展示
    if (this._selectedMenuKey) {
      this._functionCheckedKeys =
        this._menuFunctionCheckedMap.get(this._selectedMenuKey) || [];
    }
  };

  /** 确保菜单在勾选集合中（勾选了功能但菜单未勾选时自动补上） */
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
   * 设置功能选中状态。
   * 联动：勾选了功能时自动勾选所属菜单，避免出现「有功能无菜单」的无效配置。
   */
  public setFunctionCheckedKeys = (checkedKeys: CheckedKeys) => {
    this._functionCheckedKeys = checkedKeys;
    // 同时更新暂存的状态
    if (this._selectedMenuKey) {
      this._menuFunctionCheckedMap.set(this._selectedMenuKey, checkedKeys);

      if (this._getKeysArray(checkedKeys).length > 0) {
        this._ensureMenuChecked(this._selectedMenuKey);
      }
    }
  };

  /**
   * 设置点击选中的菜单（用于显示功能）
   */
  public setSelectedMenuKey = (menuKey: string | null) => {
    // 保存当前菜单的功能勾选状态
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

  /** 一键授权全部菜单与功能 */
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

  /** 一键清空全部已选权限 */
  public clearAllPermissions = () => {
    this._menuCheckedKeys = [];
    this._functionCheckedKeys = [];
    this._menuFunctionCheckedMap.clear();
  };

  /**
   * 重置选中状态
   */
  public resetCheckedKeys = () => {
    this._menuCheckedKeys = [];
    this._functionCheckedKeys = [];
    this._selectedMenuKey = null;
    this._menuFunctionCheckedMap.clear();
  };

  /**
   * 获取合并后的选中项列表
   */
  public getMergedCheckedKeys = (): string[] => {
    // 保存当前菜单的功能勾选状态
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
   * 编辑关联菜单
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
