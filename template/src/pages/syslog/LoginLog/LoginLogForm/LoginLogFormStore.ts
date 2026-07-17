import { LoginLogData, getLoginLog } from "@/services/apis/syslog/loginLog";

import Query from "@/services/Query";
import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { makeObservable } from "mobx";

class LoginLogFormStore extends FormModalStore<LoginLogData> {
  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * Fetch detail
   * @param id
   */
  protected _getFormData = (
    id: number | string,
    data?: Partial<LoginLogData>
  ) => {
    const query = new Query();
    data && query.toF(data, { crtTm: "BT" }, {});

    getLoginLog(id, query.value).then((res) => {
      if (res.code === 0) {
        this._formData = res.data;
      } else {
        this._message(res);
      }
    });
  };
}

export default new LoginLogFormStore();
