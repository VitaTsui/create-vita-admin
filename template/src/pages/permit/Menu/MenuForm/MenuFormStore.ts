import {
  MenuData,
  createMenu,
  editMenu,
  getMenu,
} from "@/services/apis/permit/menu";

import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { ResType } from "@/services/Axios";
import { makeObservable } from "mobx";
import { BASE_FUNCTION_TYPE } from "@/stores/OptionsStore/StaticOptions";
import { deepCopy } from "hsu-utils";

class MenuFormStore extends FormModalStore<MenuData> {
  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * Fetch detail
   * @param id
   */
  protected _getFormData = (id: number | string) => {
    getMenu(id).then((res) => {
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
  public addFormData = (data: MenuData, fn?: (res: ResType) => void) => {
    const baseFunc = data.baseFunc;

    delete data.baseFunc;

    if (baseFunc?.length) {
      const arr = baseFunc?.map((item, idx) => {
        const _data = deepCopy(data);

        _data.nm = BASE_FUNCTION_TYPE.find((i) => i.value === item)?.label;
        _data.perm = item
          .split(",")
          ?.map((i) => `${_data.perm}:${i}`.replace(/\//g, ":"))
          .join(",");
        _data.seq = +(_data.seq ?? 10) + +(10 * idx);

        if (_data.url?.endsWith(".tsx")) {
          _data.url = _data.url.replace(/\\/g, "/").split(".")[0];
        }

        return createMenu(_data);
      });

      Promise.all(arr).then((res) => {
        if (res[0].code === 0) {
          fn?.(res[0]);
        }

        this._message(res[0]);
      });
    } else {
      data.perm = data.perm?.replace(/\//g, ":");

      if (data.url?.endsWith(".tsx")) {
        data.url = data.url.replace(/\\/g, "/").split(".")[0];
      }

      createMenu(data).then((res) => {
        if (res.code === 0) {
          fn?.(res);
        }

        this._message(res);
      });
    }
  };

  /**
   * Edit
   * @param id
   * @param data
   * @param fn
   */
  public editFormData = (
    id: number | string,
    data: MenuData,
    fn?: (res: ResType) => void
  ) => {
    data.id = id;
    data.perm = data.perm?.replace(/\//g, ":");

    if (data.url?.endsWith(".tsx")) {
      data.url = data.url.replace(/\\/g, "/").split(".")[0];
    }

    editMenu(data).then((res) => {
      fn?.(res);

      this._message(res);
    });
  };
}

export default new MenuFormStore();
