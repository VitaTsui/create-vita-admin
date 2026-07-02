import {
  DictData,
  DictSearchData,
  deleteDict,
  getDictData,
} from "@/services/apis/sysmgmt/dict";

import ListPanelStore from "@/stores/basisStoreClass/ListPanelStore";
import { makeObservable } from "mobx";

class DataModalStore extends ListPanelStore<DictSearchData, DictData> {
  private _id?: number | string;

  protected accessor _isLoading = false;

  constructor() {
    super();
    makeObservable(this);
  }

  public setId = (id?: number | string) => {
    this._id = id;
  };

  /**
   * 获取列表
   */
  protected _getDataSource = () => {
    if (!this._id) return;

    this._isLoading = true;

    getDictData({ query: this._query.value, pid: this._id })
      .then((res) => {
        if (res.code === 0) {
          const data = res.data;

          this._dataSource = data.list;
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
    deleteDict(id).then((res) => {
      if (res.code === 0) {
        this.getDataSource();
      }

      this._message(res);
    });
  };
}

export default new DataModalStore();
