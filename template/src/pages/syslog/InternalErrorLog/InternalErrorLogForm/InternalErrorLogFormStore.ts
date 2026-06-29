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
   * 获取详情
   * @param id 记录ID
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
   * 新增
   * @param data 数据
   * @param fn 成功回调
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
   * 编辑
   * @param id 记录ID
   * @param data 数据
   * @param fn 成功回调
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
