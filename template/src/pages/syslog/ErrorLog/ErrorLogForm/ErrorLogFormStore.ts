import { ErrorLogData, getErrorLog } from "@/services/apis/syslog/errorLog";
import Query from "@/services/Query";

import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { makeObservable } from "mobx";

class ErrorLogFormStore extends FormModalStore<ErrorLogData> {
  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * 获取详情
   * @param id
   */
  protected _getFormData = (
    id: number | string,
    data?: Partial<ErrorLogData>
  ) => {
    const query = new Query();
    data && query.toF(data, { crtTm: "BT" }, {});

    getErrorLog(id, query.value).then((res) => {
      if (res.code === 0) {
        this._formData = res.data;
      } else {
        this._message(res);
      }
    });
  };
}

export default new ErrorLogFormStore();
