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
 * Get the list
 * @param params query params
 */
export const getDataPermissionList = async (params: DataPermissionSearch) => {
  return await get<ListRes<DataPermissionData>>(
    "/sys/roleDataLevelScope/page",
    { params }
  );
};

/**
 * Get the detail
 * @param id record ID
 */
export const getDataPermission = async (roleId: number | string) => {
  return await get<DataPermissionData>("/sys/roleDataLevelScope/infoByRoleId", {
    params: { roleId },
  });
};

/**
 * Create
 * @param data data
 */
export const createDataPermission = async (data: DataPermissionData) => {
  return await post("/sys/roleDataLevelScope/add", data);
};

/**
 * Update
 * @param data data
 */
export const editDataPermission = async (data: DataPermissionData) => {
  return await post("/sys/roleDataLevelScope/upd", data);
};

/**
 * Delete
 * @param id record ID
 */
export const deleteDataPermission = async (id: number | string) => {
  return await get("/sys/roleDataLevelScope/del", { params: { ids: id } });
};
