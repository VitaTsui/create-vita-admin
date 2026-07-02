import {
  OprLogData,
  OprLogSearchData,
  getOprLogList,
} from "@/services/apis/syslog/oprlog";
import Query from "@/services/Query";

import ListPanelStore from "@/stores/basisStoreClass/ListPanelStore";
import { makeObservable } from "mobx";

class OprLogStore extends ListPanelStore<OprLogSearchData, OprLogData> {
  protected accessor _modeType = {
    userNm__busNm: "LK",
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

    getOprLogList({ query: this._query.value })
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

    getOprLogList({ query: _query.value }).then((res) => {
      if (res.code === 0) {
        const { total } = res.data.page;
        this._total = total;
      }
    });
  };
}

export default new OprLogStore();
