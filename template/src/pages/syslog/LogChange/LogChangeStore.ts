import {
  LogChangeData,
  LogChangeSearchData,
  deleteLogChange,
  getLogChangeList,
} from "@/services/apis/syslog/logChange";
import Query from "@/services/Query";

import ListPanelStore from "@/stores/basisStoreClass/ListPanelStore";
import { makeObservable } from "mobx";

class LogChangeStore extends ListPanelStore<LogChangeSearchData, LogChangeData> {
  protected accessor _modeType = {
    nm__developer: "LK",
    releTm: "BT",
  };

  protected accessor _c: 1 | 0 = 1;

  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * Fetch list
   */
  public getDataSource = () => {
    this.getTotal();

    getLogChangeList({ query: this._query.value })
      .then((res) => {
        if (res.code === 0) {
          const { list } = res.data;

          this._dataSource = list;
        } else {
          this._message(res);
        }

        this._isLoading = false;
      })
      .catch(() => {
        this._isLoading = false;
      });
  };

  public getTotal = () => {
    const _query = new Query();
    _query.toF(this._searchData, this._modeType, {}, {});

    getLogChangeList({ query: _query.value }).then((res) => {
      if (res.code === 0) {
        const { total } = res.data.page;
        this._total = total;
      }
    });
  };

  /**
   * Delete
   * @param id
   */
  public delData = (id: number | string) => {
    deleteLogChange(id).then((res) => {
      if (res.code === 0) {
        this.getDataSource();
      }

      this._message(res);
    });
  };
}

export default new LogChangeStore();
