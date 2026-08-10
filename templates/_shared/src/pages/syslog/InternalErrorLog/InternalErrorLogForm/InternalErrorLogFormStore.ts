import {
  InternalErrorLogData,
  createInternalErrorLog,
  editInternalErrorLog,
  getInternalErrorLog,
} from "@/services/apis/syslog/internalerrorlog";

import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { ResType } from "@/services/Axios";
import { makeObservable } from "mobx";

class InternalErrorLogFormStore extends FormModalStore<InternalErrorLogData> {
  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * Fetch detail
   * @param id Record ID
   */
  protected _getFormData = (id: number | string) => {
    getInternalErrorLog(id).then((res) => {
      if (res.code === 0) {
        this._formData = res.data;
      } else {
        this._message(res);
      }
    });
  };

  /**
   * Create
   * @param data Data
   * @param fn Success callback
   */
  public addFormData = (
    data: InternalErrorLogData,
    fn?: (res: ResType) => void
  ) => {
    createInternalErrorLog(data).then((res) => {
      if (res.code === 0) {
        fn?.(res);
      }

      this._message(res);
    });
  };

  /**
   * Edit
   * @param id Record ID
   * @param data Data
   * @param fn Success callback
   */
  public editFormData = (
    id: number | string,
    data: InternalErrorLogData,
    fn?: (res: ResType) => void
  ) => {
    data.id = id;

    editInternalErrorLog(data).then((res) => {
      fn?.(res);

      this._message(res);
    });
  };
}

export default new InternalErrorLogFormStore();
