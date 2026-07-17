import {
  SmsLogData,
  SmsLogSearchData,
  deleteSmsLog,
  getSmsLogList,
} from "@/services/apis/sysmgmt/sms/smslog";

import ListPanelStore from "@/stores/basisStoreClass/ListPanelStore";
import { makeObservable } from "mobx";

class SmsLogStore extends ListPanelStore<SmsLogSearchData, SmsLogData> {
  protected accessor _modeType = {
    mob: "LK",
    smsConfId: "EQ",
    smsTemplateCd: "EQ",
    status: "EQ",
    sendTm: "BT",
  };

  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * Fetch list
   */
  public getDataSource = () => {
    getSmsLogList({ query: this._query.value })
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
   * Delete
   * @param id
   */
  public delData = (id: number | string) => {
    deleteSmsLog(id).then((res) => {
      if (res.code === 0) {
        this.getDataSource();
      }

      this._message(res);
    });
  };
}

export default new SmsLogStore();
