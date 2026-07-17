import {
  SmsTemplateData,
  createSmsTemplate,
  editSmsTemplate,
  getSmsTemplate,
} from "@/services/apis/sysmgmt/sms/smstemplate";

import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { ResType } from "@/services/Axios";
import { makeObservable } from "mobx";

class SmsTemplateFormStore extends FormModalStore<SmsTemplateData> {
  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * Fetch detail
   * @param id
   */
  protected _getFormData = (id: number | string) => {
    getSmsTemplate(id).then((res) => {
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
  public addFormData = (data: SmsTemplateData, fn?: (res: ResType) => void) => {
    createSmsTemplate(data).then((res) => {
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
    data: SmsTemplateData,
    fn?: (res: ResType) => void
  ) => {
    data.id = id;

    editSmsTemplate(data).then((res) => {
      fn?.(res);

      this._message(res);
    });
  };
}

export default new SmsTemplateFormStore();
