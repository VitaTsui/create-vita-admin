import {
  RolePermissionsData,
  createRolePermissions,
  editRolePermissions,
  getRolePermissions,
} from "@/services/apis/permit/Role/role";
import { makeObservable } from "mobx";

import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { ResType } from "@/services/Axios";

class RoleFormStore extends FormModalStore<RolePermissionsData> {
  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * 获取详情
   * @param id
   */
  protected _getFormData = (id: number | string) => {
    getRolePermissions(id).then((res) => {
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
  public addFormData = (
    data: RolePermissionsData,
    fn?: (res: ResType) => void
  ) => {
    createRolePermissions(data).then((res) => {
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
    data: RolePermissionsData,
    fn?: (res: ResType) => void
  ) => {
    data.id = id;

    editRolePermissions(data).then((res) => {
      fn?.(res);

      this._message(res);
    });
  };
}

export default new RoleFormStore();
