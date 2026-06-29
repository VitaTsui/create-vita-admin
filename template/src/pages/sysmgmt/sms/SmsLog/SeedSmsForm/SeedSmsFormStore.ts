import { SendSmsData, sendSms } from "@/services/apis/sysmgmt/sms/smslog";

import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { makeObservable } from "mobx";

class SeedSmsFormStore extends FormModalStore<SendSmsData> {
  constructor() {
    super();
    makeObservable(this);
  }

  public sendSms = (data: SendSmsData, fn?: () => void) => {
    sendSms(data).then((res) => {
      if (res.code === 0) {
        fn?.();
      }

      this._message(res);
    });
  };
}

export default new SeedSmsFormStore();
