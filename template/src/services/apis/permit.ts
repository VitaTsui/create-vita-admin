import { get } from "../Axios";

// Get the menu list
export interface MenuListData {
  topMenuList: MenuList[];
  menuList: MenuList[];
  topId: null;
  topList: null;
}
export interface MenuList {
  id: string;
  nm: string;
  pid: string | null;
  seq: number;
  level: number;
  children: MenuList[] | null;
  path: string;
  url: string;
  perm: string;
  icon: string;
  status: number | null;
}
export const getMenuList = async (
  params: { project: number } = { project: 0 }
) => {
  return await get<MenuListData>("/sys/menu/getMenuATopATopMenu", { params });
};

// Get permission info
export interface PermissionsInfo {
  stringPermissions: string[];
}
export const getPermissions = async (
  params: { project: number } = { project: 0 }
) => {
  return await get<PermissionsInfo>("/sys/menu/getStringPermissions", {
    params,
  });
};
