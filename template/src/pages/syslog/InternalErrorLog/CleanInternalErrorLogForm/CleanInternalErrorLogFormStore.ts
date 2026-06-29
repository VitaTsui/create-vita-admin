import { cleanInternalErrorLog } from "@/services/apis/syslog/internalerrorlog";

import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { ResType } from "@/services/Axios";
import { computed, makeObservable, observable } from "mobx";

interface CleanLogData {
  retentionPeriod: string;
}

class CleanInternalErrorLogFormStore extends FormModalStore<CleanLogData> {
  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * 加载状态
   */
  @computed
  get loading() {
    return this._loading;
  }
  @observable
  private accessor _loading: boolean = false;

  /**
   * 清理日志
   * @param retentionPeriod 保留期限
   * @param fn 成功回调
   */
  public cleanLog = (
    retentionPeriod: string,
    fn?: (res: ResType) => void
  ) => {
    this._loading = true;
    cleanInternalErrorLog(retentionPeriod)
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

export default new CleanInternalErrorLogFormStore();

