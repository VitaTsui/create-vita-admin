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
  /** 外部部门 ID（钉钉） */
  outId: string;
  /** 来源：0 自建，1 钉钉 */
  source: number;
}
export type DeptData = Partial<IDeptData>;

// 列表
export const getDeptList = async (params: DeptSearch) => {
  return await get<ListRes<DeptData>>("/sys/org/listTreeNode", { params });
};

// 详情
export const getDept = async (id: number | string) => {
  return await get<DeptData>("/sys/org/info/" + id);
};

// 新增
export const createDept = async (data: DeptData) => {
  return await post("/sys/org/add", data);
};

// 修改
export const editDept = async (data: DeptData) => {
  return await post("/sys/org/upd", data);
};

// 删除
export const deleteDept = async (id: number | string) => {
  return await get("/sys/org/del", { params: { ids: id } });
};

// 钉钉部门树（供同步弹窗勾选）
export const getDingtalkOrgTree = async () => {
  return await get<DeptData[]>("/sys/org/dingtalk/tree");
};

// 同步/导入钉钉部门（空数组表示全量）
export const importDingtalkOrg = async (deptIds: (string | number)[]) => {
  return await post<number>("/sys/org/dingtalk/import", deptIds);
};
