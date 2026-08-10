import { get, post } from "@/services/Axios";

import { ListRes } from "@/services/ResType";

export interface RolePermissionsSearchData {}

interface RolePermissionsSearch {
  query: string;
}

interface IRolePermissionsData {
  id: string | number;
  pid: null;
  cd: string;
  nm: string;
  rmks: string;
  status: number;
  type: number;
  tntId: string;
  crtTm: string;
  crtBy: string;
  updTm: string;
  updBy: string;
  statusDsr: string;
  typeDsr: string;
  rscoIdList: Array<string | number>;
}
export type RolePermissionsData = Partial<IRolePermissionsData>;

// List
export const getRolePermissionsList = async (params: RolePermissionsSearch) => {
  return await get<ListRes<RolePermissionsData>>("/sys/role/page", {
    params,
  });
};

// Detail
export const getRolePermissions = async (id: number | string) => {
  return await get<RolePermissionsData>("/sys/role/info/" + id);
};

// Create
export const createRolePermissions = async (data: RolePermissionsData) => {
  return await post("/sys/role/add", data);
};

// Update
export const editRolePermissions = async (data: RolePermissionsData) => {
  return await post("/sys/role/upd", data);
};

// Delete
export const deleteRolePermissions = async (id: number | string) => {
  return await get("/sys/role/del", { params: { ids: id } });
};

interface MenuLis {
  id: string | number;
  nm: string;
  pid: string;
  seq: number;
  level: number;
  children: MenuLis[];
  path: string;
  url: string;
  perm: string;
  icon: string;
  rmks: string;
  type: number;
  cat: number;
}
export type MenuListData = Partial<MenuLis>;

export interface PermRtRscoTreeNode {
  subId: string | number;
}

export interface PermRtRscoTreeNodeRes {
  checkedKeys: string[];
  list: MenuListData[];
}

// Get the menus associated with a role
export const getPermRtRscoTreeNode = async (params: PermRtRscoTreeNode) => {
  return await get<PermRtRscoTreeNodeRes>("/sys/rsco/listPermRtRscoTreeNode", {
    params,
  });
};

interface RoleRtRscoData {
  id: string | number;
  rscoIdList: string[];
}
export type RoleRtRsco = Partial<RoleRtRscoData>;

// Update the menus associated with a role
export const updateRoleRtRsco = async (data: RoleRtRsco) => {
  return await post("/sys/role/updRoleRsco", data);
};
