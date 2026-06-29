import { get, post } from "@/services/Axios";

import { ListRes } from "@/services/ResType";

export interface UserSearchData {}

interface UserSearch {
  query: string;
  orgId?: string;
}

interface IUserData {
  id: string | number;
  subId: string;
  orgId: string;
  username: string;
  nickname: string;
  salt: string;
  password: string;
  card: string;
  phone: string;
  mob: string;
  email: string;
  sex: string;
  imgUrl: string;
  openId: string;
  unionId: string;
  account: string;
  accountId: string;
  employeeCode: string;
  employeeName: string;
  vldFrTm: string;
  vldToTm: string;
  unlockTm: string;
  rmks: string;
  type: number;
  status: number;
  arg1: string;
  arg2: string;
  arg3: string;
  arg4: string;
  arg5: string;
  arg6: string;
  arg7: string;
  arg8: number;
  arg9: string;
  tntId: string;
  crtTm: string;
  crtBy: string;
  updTm: string;
  updBy: string;
  typeDsr: string;
  statusDsr: string;
  number: number;
  roleIdList: string[];
}
export type UserData = Partial<IUserData>;

// 列表
export const getUserList = async (params: UserSearch) => {
  return await get<ListRes<UserData>>("/sys/user/pageUserByOrg", { params });
};

// 详情
export const getUser = async (id: number | string) => {
  return await get<UserData>("/sys/user/info/" + id);
};

// 新增
export const createUser = async (data: UserData) => {
  return await post("/sys/user/add", data);
};

// 修改
export const editUser = async (data: UserData) => {
  return await post("/sys/user/upd", data);
};

// 删除
export const deleteUser = async (id: number | string) => {
  return await get("/sys/user/del", { params: { ids: id } });
};

// 用户密码重置
export const resetUserPwd = async (data: {
  id: number | string;
  password: string;
}) => {
  return await post("/sys/user/resetPwd", data);
};

// 用户状态修改
export const updateUserStatus = async (id: number | string, status: number) => {
  if (status === 1) {
    return await get("/sys/user/freeze", { params: { ids: id } });
  }

  return await get("/sys/user/unfreeze", { params: { ids: id } });
};

interface RoleListData {
  id: string;
  nm: string;
}
export interface UserRoleRtRoleNodeRes {
  checkedKeys: string[];
  list: RoleListData[];
}

// 查询关联角色
export const getUserRoleRtRoleNode = async (params: {
  userId: number | string;
}) => {
  return await get<UserRoleRtRoleNodeRes>("/sys/role/listUserRoleRtRoleNode", {
    params,
  });
};

interface RoleRtRscoData {
  id: string | number;
  rscoIdList: string[];
}
export type RoleRtRsco = Partial<RoleRtRscoData>;

// 修改用户角色
export const updateUserRole = async (data: RoleRtRsco) => {
  return await post("/sys/user/updUserRole", data);
};

// 获取部门树
export interface OrgTreeListData {
  id: string;
  nm: string;
  pid: null;
  seq: number;
  level: number;
  children: OrgTreeListData[];
  cd: null | string;
  rmks: null | string;
}
export const getListTreeNode = async (params: { query: string }) => {
  return await get<ListRes<OrgTreeListData>>("/sys/org/listTreeNode", {
    params,
  });
};
