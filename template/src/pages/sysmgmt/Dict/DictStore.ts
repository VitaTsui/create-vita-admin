import {
  DictData,
  DictSearchData,
  deleteDict,
  getDictList,
} from "@/services/apis/sysmgmt/dict";

import ListPanelStore from "@/stores/basisStoreClass/ListPanelStore";
import { makeObservable } from "mobx";

class DictStore extends ListPanelStore<DictSearchData, DictData> {
  protected accessor _modeType = {
    tid: "IS",
  };

  protected accessor _staticSearchData = {
    tid: 0,
  };

  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * 获取列表
   */
  protected _getDataSource = () => {
    getDictList({ query: this._query.value })
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
    deleteDict(id).then((res) => {
      if (res.code === 0) {
        this.getDataSource();
      }

      this._message(res);
    });
  };
}

export default new DictStore();
