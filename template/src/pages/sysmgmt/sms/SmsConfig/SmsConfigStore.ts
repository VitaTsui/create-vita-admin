import {
  SmsConfigData,
  SmsConfigSearchData,
  deleteSmsConfig,
  getSmsConfigList,
} from "@/services/apis/sysmgmt/sms/smsconfig";

import ListPanelStore from "@/stores/basisStoreClass/ListPanelStore";
import { makeObservable } from "mobx";

class SmsConfigStore extends ListPanelStore<
  SmsConfigSearchData,
  SmsConfigData
> {
  protected accessor _modeType = {
    nm: "LK",
    active: "EQ",
    type: "EQ",
    status: "EQ",
    crtTm: "BT",
  };

  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * Fetch list
   */
  public getDataSource = () => {
    getSmsConfigList({ query: this._query.value })
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
    deleteSmsConfig(id).then((res) => {
      if (res.code === 0) {
        this.getDataSource();
      }

      this._message(res);
    });
  };
}

export default new SmsConfigStore();
