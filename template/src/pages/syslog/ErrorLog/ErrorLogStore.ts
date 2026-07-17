import {
  ErrorLogData,
  ErrorLogSearchData,
  getErrorLogList,
} from "@/services/apis/syslog/errorLog";
import Query from "@/services/Query";

import ListPanelStore from "@/stores/basisStoreClass/ListPanelStore";
import { makeObservable } from "mobx";

class ErrorLogStore extends ListPanelStore<ErrorLogSearchData, ErrorLogData> {
  protected accessor _modeType = {
    username: "LK",
    ip: "LK",
    uri: "LK",
    crtTm: "BT",
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

    getErrorLogList({ query: this._query.value })
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

    getErrorLogList({ query: _query.value }).then((res) => {
      if (res.code === 0) {
        const { total } = res.data.page;
        this._total = total;
      }
    });
  };
}

export default new ErrorLogStore();
