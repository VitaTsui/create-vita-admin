import { get, post } from "@/services/Axios";

import { ListRes } from "@/services/ResType";

export interface DataPermissionSearchData {}

interface DataPermissionSearch {
  query: string;
}

interface IDataPermissionData {
  id: string | number;
}

export type DataPermissionData = Partial<IDataPermissionData>;

/**
 * 获取列表
 * @param params 查询参数
 */
export const getDataPermissionList = async (params: DataPermissionSearch) => {
  return await get<ListRes<DataPermissionData>>(
    "/sys/roleDataLevelScope/page",
    { params }
  );
};

/**
 * 获取详情
 * @param id 记录ID
 */
export const getDataPermission = async (roleId: number | string) => {
  return await get<DataPermissionData>("/sys/roleDataLevelScope/infoByRoleId", {
    params: { roleId },
  });
};

/**
 * 新增
 * @param data 数据
 */
export const createDataPermission = async (data: DataPermissionData) => {
  return await post("/sys/roleDataLevelScope/add", data);
};

/**
 * 修改
 * @param data 数据
 */
export const editDataPermission = async (data: DataPermissionData) => {
  return await post("/sys/roleDataLevelScope/upd", data);
};

/**
 * 删除
 * @param id 记录ID
 */
export const deleteDataPermission = async (id: number | string) => {
  return await get("/sys/roleDataLevelScope/del", { params: { ids: id } });
};
