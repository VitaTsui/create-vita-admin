import { get } from "../Axios";
import { ListRes } from "../ResType";

export interface EnumItem {
  cd: number;
  nm: string;
}
export interface EnumList {
  list: EnumItem[];
}
export const getEnum = async (cls: string) => {
  return await get<EnumList>("/sys/enum/list", { params: { cls } });
};

export const getEnumByPcd = async (cd: string) => {
  return await get<EnumList>("/sys/cat/listByPcd", { params: { cd } });
};

export const getEnumPageByPcd = async (cd: string, query: string) => {
  return await get<ListRes<EnumItem>>("/sys/cat/pageByPcd", {
    params: { cd, query },
  });
};

/**
 * Role list
 */
interface RoleItem {
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
export interface RoleList {
  list: RoleItem[];
}
export const getRoleList = async () => {
  return await get<RoleList>("/sys/role/list");
};

// User list
export const getUserList = async () => {
  return await get<ListRes<{ id: string | number; nickname: string }>>(
    "/sys/user/list",
  );
};

// SMS config list
export const getSmsConfigList = async () => {
  return await get<ListRes<{ id: string | number; nm: string }>>(
    "/sys/smsConf/list",
  );
};

// SMS template list
export const getSmsTemplateList = async () => {
  return await get<ListRes<{ cd: string | number; nm: string }>>(
    "/sys/smsTemplate/list",
  );
};
