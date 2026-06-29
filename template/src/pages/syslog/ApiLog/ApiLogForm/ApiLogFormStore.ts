import Query from "@/services/Query";
import { ApiLogData, getApiLog } from "@/services/apis/syslog/apiLog";

import { APILOG_STATUS } from "@/stores/OptionsStore/StaticOptions";
import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { makeObservable } from "mobx";

class ApiLogFormStore extends FormModalStore<ApiLogData> {
  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * 获取详情
   * @param id
   */
  protected _getFormData = (id: number | string, data?: Partial<ApiLogData>) => {
    const query = new Query();
    data && query.toF(data, { crtTm: "BT" }, {});

    getApiLog(id, query.value).then((res) => {
      if (res.code === 0) {
        const data = res.data;

        data.statusDsr = APILOG_STATUS.find(
          (item) => item.value === data.status
        )?.label;

        this._formData = res.data;
      } else {
        this._message(res);
      }
    });
  };
}

export default new ApiLogFormStore();
