import {
  LogChangeData,
  createLogChange,
  editLogChange,
  getLogChange,
} from "@/services/apis/syslog/logChange";

import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { ResType } from "@/services/Axios";
import { makeObservable } from "mobx";

class LogChangeFormStore extends FormModalStore<LogChangeData> {
  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * 获取详情
   * @param id
   */
  protected _getFormData = (id: number | string) => {
    getLogChange(id).then((res) => {
      if (res.code === 0) {
        this._formData = res.data;
      } else {
        this._message(res);
      }
    });
  };

  /**
   * 新增
   * @param data
   * @param fn
   */
  public addFormData = (data: LogChangeData, fn?: (res: ResType) => void) => {
    createLogChange(data).then((res) => {
      if (res.code === 0) {
        fn?.(res);
      }

      this._message(res);
    });
  };

  /**
   * 编辑
   * @param id
   * @param data
   * @param fn
   */
  public editFormData = (
    id: number | string,
    data: LogChangeData,
    fn?: (res: ResType) => void
  ) => {
    data.id = id;

    editLogChange(data).then((res) => {
      fn?.(res);

      this._message(res);
    });
  };
}

export default new LogChangeFormStore();
