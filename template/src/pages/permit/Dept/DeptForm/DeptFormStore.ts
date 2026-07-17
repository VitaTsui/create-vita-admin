import {
  DeptData,
  createDept,
  editDept,
  getDept,
} from "@/services/apis/permit/dept";

import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { ResType } from "@/services/Axios";
import { makeObservable } from "mobx";

class DeptFormStore extends FormModalStore<DeptData> {
  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * Fetch detail
   * @param id
   */
  protected _getFormData = (id: number | string) => {
    getDept(id).then((res) => {
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
  public addFormData = (data: DeptData, fn?: (res: ResType) => void) => {
    createDept(data).then((res) => {
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
    data: DeptData,
    fn?: (res: ResType) => void
  ) => {
    data.id = id;

    editDept(data).then((res) => {
      fn?.(res);

      this._message(res);
    });
  };
}

export default new DeptFormStore();
