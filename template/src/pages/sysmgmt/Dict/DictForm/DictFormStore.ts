import {
  DictData,
  createDict,
  editDict,
  getDict,
} from "@/services/apis/sysmgmt/dict";

import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { ResType } from "@/services/Axios";
import { makeObservable } from "mobx";

class DictFormStore extends FormModalStore<DictData> {
  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * Fetch detail
   * @param id
   */
  protected _getFormData = (id: number | string) => {
    getDict(id).then((res) => {
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
  public addFormData = (data: DictData, fn?: (res: ResType) => void) => {
    createDict(data).then((res) => {
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
    data: DictData,
    fn?: (res: ResType) => void
  ) => {
    data.id = id;

    editDict(data).then((res) => {
      fn?.(res);

      this._message(res);
    });
  };
}

export default new DictFormStore();
