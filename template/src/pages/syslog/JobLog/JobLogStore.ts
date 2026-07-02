import {
  JobLogData,
  JobLogSearchData,
  getJobLogList,
} from "@/services/apis/syslog/joblog";
import Query from "@/services/Query";

import ListPanelStore from "@/stores/basisStoreClass/ListPanelStore";
import { makeObservable } from "mobx";

class JobLogStore extends ListPanelStore<JobLogSearchData, JobLogData> {
  protected accessor _modeType = {
    crtTm: "BT",
    nm: "LK",
    status: "EQ",
    execStartTm: "LK",
    execEndTm: "LK",
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

    getJobLogList({ query: this._query.value })
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

    getJobLogList({ query: _query.value }).then((res) => {
      if (res.code === 0) {
        const { total } = res.data.page;
        this._total = total;
      }
    });
  };
}

export default new JobLogStore();
