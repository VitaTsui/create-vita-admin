import {
  ApiLogData,
  ApiLogSearchData,
  getApiLogList,
} from "@/services/apis/syslog/apiLog";

import ListPanelStore from "@/stores/basisStoreClass/ListPanelStore";
import { makeObservable } from "mobx";
import Query from "@/services/Query";

class ApiLogStore extends ListPanelStore<ApiLogSearchData, ApiLogData> {
  protected accessor _modeType = {
    username: "LK",
    nm: "LK",
    uri: "LK",
    ip: "LK",
    crtTm: "BT",
  };

  protected accessor _c: 1 | 0 = 1;

  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * 获取列表
   */
  protected _getDataSource = () => {
    this.getTotal();

    getApiLogList({ query: this._query.value })
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

    getApiLogList({ query: _query.value }).then((res) => {
      if (res.code === 0) {
        const { total } = res.data.page;
        this._total = total;
      }
    });
  };
}

export default new ApiLogStore();
