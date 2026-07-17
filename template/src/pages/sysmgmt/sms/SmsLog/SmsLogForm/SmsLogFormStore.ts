import {
  SmsLogData,
  createSmsLog,
  editSmsLog,
  getSmsLog,
} from "@/services/apis/sysmgmt/sms/smslog";

import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { ResType } from "@/services/Axios";
import { makeObservable } from "mobx";

class SmsLogFormStore extends FormModalStore<SmsLogData> {
  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * Fetch detail
   * @param id
   */
  protected _getFormData = (id: number | string) => {
    getSmsLog(id).then((res) => {
      if (res.code === 0) {
        this._formData = res.data;
      } else {
        this._message(res);
      }
    });
  };

  /**
   * Create
   * @param data
   * @param fn
   */
  public addFormData = (data: SmsLogData, fn?: (res: ResType) => void) => {
    createSmsLog(data).then((res) => {
      if (res.code === 0) {
        fn?.(res);
      }

      this._message(res);
    });
  };

  /**
   * Edit
   * @param id
   * @param data
   * @param fn
   */
  public editFormData = (
    id: number | string,
    data: SmsLogData,
    fn?: (res: ResType) => void
  ) => {
    data.id = id;

    editSmsLog(data).then((res) => {
      fn?.(res);

      this._message(res);
    });
  };
}

export default new SmsLogFormStore();
