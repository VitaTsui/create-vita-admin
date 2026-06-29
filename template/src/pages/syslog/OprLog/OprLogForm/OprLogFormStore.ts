import { OprLogData, getOprLog } from "@/services/apis/syslog/oprlog";

import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { makeObservable } from "mobx";

class OprLogFormStore extends FormModalStore<OprLogData> {
  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * 获取详情
   * @param id
   */
  protected _getFormData = (id: number | string) => {
    getOprLog(id).then((res) => {
      if (res.code === 0) {
        this._formData = res.data;
      } else {
        this._message(res);
      }
    });
  };
}

export default new OprLogFormStore();
