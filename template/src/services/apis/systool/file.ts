import { get, post } from "@/services/Axios";

import { ListRes } from "@/services/ResType";

export interface FileSearchData {}

interface FileSearch {
  query: string;
}

interface Config {
  accessKey: string;
  accessSecret: string;
  bucket: string;
  domain: string;
  endpoint: string;

  [key: string]: string;
}

export type TypeConfig = Partial<Config>;

interface IFileData {
  id: string | number;
  type: number;
  config: TypeConfig;

  [key: string]: unknown;
}
export type FileData = Partial<IFileData>;

// 列表
export const getFileList = async (params: FileSearch) => {
  return await get<ListRes<FileData>>("/sys/fileConf/page", { params });
};

// 详情
export const getFile = async (id: number | string) => {
  return await get<FileData>("/sys/fileConf/info/" + id);
};

// 新增
export const createFile = async (data: FileData) => {
  return await post("/sys/fileConf/add", data);
};

// 修改
export const editFile = async (data: FileData) => {
  return await post("/sys/fileConf/upd", data);
};

// 删除
export const deleteFile = async (id: number | string) => {
  return await get("/sys/fileConf/del", { params: { ids: id } });
};
