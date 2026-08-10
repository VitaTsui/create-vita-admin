import {
  SmsConfigData,
  createSmsConfig,
  editSmsConfig,
  getSmsConfig,
} from "@/services/apis/sysmgmt/sms/smsconfig";

import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { ResType } from "@/services/Axios";
import { makeObservable } from "mobx";

class SmsConfigFormStore extends FormModalStore<SmsConfigData> {
  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * Fetch detail
   * @param id
   */
  protected _getFormData = (id: number | string) => {
    getSmsConfig(id).then((res) => {
      if (res.code === 0) {
        const data = res.data;

        if (data.config) {
          const config = JSON.parse(data.config);
          Object.keys(config)?.forEach((key) => {
            data[key] = config[key];
          });
        }

        this._formData = data;
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
  public addFormData = (data: SmsConfigData, fn?: (res: ResType) => void) => {
    createSmsConfig(data).then((res) => {
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
    data: SmsConfigData,
    fn?: (res: ResType) => void
  ) => {
    data.id = id;

    editSmsConfig(data).then((res) => {
      fn?.(res);

      this._message(res);
    });
  };
}

export default new SmsConfigFormStore();
