import {
  SmsTemplateData,
  SmsTemplateSearchData,
  deleteSmsTemplate,
  getSmsTemplateList,
} from "@/services/apis/sysmgmt/sms/smstemplate";

import ListPanelStore from "@/stores/basisStoreClass/ListPanelStore";
import { makeObservable } from "mobx";

class SmsTemplateStore extends ListPanelStore<
  SmsTemplateSearchData,
  SmsTemplateData
> {
  protected accessor _modeType = {
    cd__nm__cont: "LK",
    type: "EQ",
  };

  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * 获取列表
   */
  public getDataSource = () => {
    getSmsTemplateList({ query: this._query.value })
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
    deleteSmsTemplate(id).then((res) => {
      if (res.code === 0) {
        this.getDataSource();
      }

      this._message(res);
    });
  };
}

export default new SmsTemplateStore();
