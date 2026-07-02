import {
  LoginLogData,
  LoginLogSearchData,
  getLoginLogList,
} from "@/services/apis/syslog/loginLog";
import Query from "@/services/Query";

import ListPanelStore from "@/stores/basisStoreClass/ListPanelStore";
import { makeObservable } from "mobx";

class LoginLogStore extends ListPanelStore<LoginLogSearchData, LoginLogData> {
  protected accessor _modeType = {
    username: "LK",
    ip: "LK",
    crtTm: "BT",
    status: "EQ",
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

    getLoginLogList({ query: this._query.value })
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

    getLoginLogList({ query: _query.value }).then((res) => {
      if (res.code === 0) {
        const { total } = res.data.page;
        this._total = total;
      }
    });
  };
}

export default new LoginLogStore();
