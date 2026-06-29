import { get, post } from "@/services/Axios";

import { ListRes } from "@/services/ResType";

export interface MenuSearchData {}

interface MenuSearch {
  query: string;
}

interface IMenuData {
  id: string | number;
  nm: string;
  pid: string;
  seq: number;
  level: number;
  children: IMenuData[];
  path: string;
  url: string;
  perm: string;
  icon: string;
  rmks: string;
  type: number;
  cat: number;
  baseFunc: string[];
}
export type MenuData = Partial<IMenuData>;

// 列表
export const getMenuList = async (params: MenuSearch) => {
  return await get<ListRes<MenuData>>("/sys/rsco/listTreeNode", { params });
};

// 详情
export const getMenu = async (id: number | string) => {
  return await get<MenuData>("/sys/rsco/info/" + id);
};

// 新增
export const createMenu = async (data: MenuData) => {
  return await post("/sys/rsco/add", data);
};

// 修改
export const editMenu = async (data: MenuData) => {
  return await post("/sys/rsco/upd", data);
};

// 删除
export const deleteMenu = async (id: number | string) => {
  return await get("/sys/rsco/del", { params: { ids: id } });
};
