import {
  FileData,
  createFile,
  editFile,
  getFile,
} from "@/services/apis/systool/file";

import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { ResType } from "@/services/Axios";
import { makeObservable } from "mobx";

const Configkey: string[] = [
  "accessKey",
  "accessSecret",
  "bucket",
  "domain",
  "endpoint",
];

class FileFormStore extends FormModalStore<FileData> {
  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * 获取详情
   * @param id
   */
  protected _getFormData = (id: number | string) => {
    getFile(id).then((res) => {
      if (res.code === 0) {
        const data = res.data;
        const { config } = data;

        if (config) {
          Object.keys(config)?.forEach((key) => {
            data[key] = config[key];
          });
        }

        this._formData = data;
      } else {
        this._message(res);
      }
    });
  };

  /**
   * 新增
   * @param data
   * @param fn
   */
  public addFormData = (data: FileData, fn?: (res: ResType) => void) => {
    Object.keys(data)?.forEach((key) => {
      if (Configkey.includes(key)) {
        if (!data.config) data.config = {};

        data.config[key] = data[key] as string;

        delete data[key];
      }
    });

    createFile(data).then((res) => {
      if (res.code === 0) {
        fn?.(res);
      }

      this._message(res);
    });
  };

  /**
   * 编辑
   * @param id
   * @param data
   * @param fn
   */
  public editFormData = (
    id: number | string,
    data: FileData,
    fn?: (res: ResType) => void
  ) => {
    data.id = id;

    Object.keys(data)?.forEach((key) => {
      if (Configkey.includes(key)) {
        if (!data.config) data.config = {};

        data.config[key] = data[key] as string;

        delete data[key];
      }
    });

    editFile(data).then((res) => {
      fn?.(res);

      this._message(res);
    });
  };
}

export default new FileFormStore();
