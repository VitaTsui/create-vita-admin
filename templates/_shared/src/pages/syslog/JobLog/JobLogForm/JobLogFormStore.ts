import { JobLogData, getJobLog } from "@/services/apis/syslog/joblog";
import Query from "@/services/Query";
import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { makeObservable } from "mobx";

class JobLogFormStore extends FormModalStore<JobLogData> {
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
    data?: Partial<JobLogData>
  ) => {
    const query = new Query();
    data && query.toF(data, { crtTm: "BT" }, {});

    getJobLog(id, query.value).then((res) => {
      if (res.code === 0) {
        this._formData = res.data;
      } else {
        this._message(res);
      }
    });
  };
}

export default new JobLogFormStore();
