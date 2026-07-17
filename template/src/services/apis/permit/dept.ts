import { get, post } from "@/services/Axios";

import { ListRes } from "@/services/ResType";

export interface DeptSearchData {}

interface DeptSearch {
  query: string;
}

interface IDeptData {
  id: string | number;
  nm: string;
  pid: string | number;
  seq: number;
  level: number;
  children: IDeptData[];
  cd: string;
  rmks: string;
  /** External department ID (DingTalk) */
  outId: string;
  /** Source: 0 self-created, 1 DingTalk */
  source: number;
}
export type DeptData = Partial<IDeptData>;

// List
export const getDeptList = async (params: DeptSearch) => {
  return await get<ListRes<DeptData>>("/sys/org/listTreeNode", { params });
};

// Detail
export const getDept = async (id: number | string) => {
  return await get<DeptData>("/sys/org/info/" + id);
};

// Create
export const createDept = async (data: DeptData) => {
  return await post("/sys/org/add", data);
};

// Update
export const editDept = async (data: DeptData) => {
  return await post("/sys/org/upd", data);
};

// Delete
export const deleteDept = async (id: number | string) => {
  return await get("/sys/org/del", { params: { ids: id } });
};

// DingTalk department tree (for selection in the sync modal)
export const getDingtalkOrgTree = async () => {
  return await get<DeptData[]>("/sys/org/dingtalk/tree");
};

// Sync/import DingTalk departments (an empty array means all)
export const importDingtalkOrg = async (deptIds: (string | number)[]) => {
  return await post<number>("/sys/org/dingtalk/import", deptIds);
};
