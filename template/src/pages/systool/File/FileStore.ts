import {
  FileData,
  FileSearchData,
  deleteFile,
  getFileList,
} from "@/services/apis/systool/file";

import ListPanelStore from "@/stores/basisStoreClass/ListPanelStore";
import { makeObservable } from "mobx";

class FileStore extends ListPanelStore<FileSearchData, FileData> {
  protected accessor _modeType = {
    active: "EQ",
    type: "EQ",
    status: "EQ",
  };

  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * 获取列表
   */
  public getDataSource = () => {
    getFileList({ query: this._query.value })
      .then((res) => {
        if (res.code === 0) {
          const { list, page } = res.data;
          const { total } = page;

          this._dataSource = list;
          this._total = total;
        } else {
          this._message(res);
        }

        this._isLoading = false;
      })
      .catch(() => {
        this._isLoading = false;
      });
  };

  /**
   * 删除
   * @param id
   */
  public delData = (id: number | string) => {
    deleteFile(id).then((res) => {
      if (res.code === 0) {
        this.getDataSource();
      }

      this._message(res);
    });
  };
}

export default new FileStore();
