import { cleanJobLog } from "@/services/apis/syslog/joblog";

import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { ResType } from "@/services/Axios";
import { computed, makeObservable, observable } from "mobx";

interface CleanLogData {
  retentionPeriod: string;
}

class CleanJobLogFormStore extends FormModalStore<CleanLogData> {
  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * Loading state
   */
  @computed
  get loading() {
    return this._loading;
  }
  @observable
  private accessor _loading: boolean = false;

  /**
   * Clean logs
   * @param retentionPeriod Retention period
   * @param fn Success callback
   */
  public cleanLog = (
    retentionPeriod: string,
    fn?: (res: ResType) => void
  ) => {
    this._loading = true;
    cleanJobLog(retentionPeriod)
      .then((res) => {
        if (res.code === 0) {
          fn?.(res);
        }

        this._message(res);
      })
      .catch((error) => {
        this._message(error);
      })
      .finally(() => {
        this._loading = false;
      });
  };
}

export default new CleanJobLogFormStore();

