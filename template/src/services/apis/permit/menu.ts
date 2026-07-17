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

// List
export const getMenuList = async (params: MenuSearch) => {
  return await get<ListRes<MenuData>>("/sys/rsco/listTreeNode", { params });
};

// Detail
export const getMenu = async (id: number | string) => {
  return await get<MenuData>("/sys/rsco/info/" + id);
};

// Create
export const createMenu = async (data: MenuData) => {
  return await post("/sys/rsco/add", data);
};

// Update
export const editMenu = async (data: MenuData) => {
  return await post("/sys/rsco/upd", data);
};

// Delete
export const deleteMenu = async (id: number | string) => {
  return await get("/sys/rsco/del", { params: { ids: id } });
};
