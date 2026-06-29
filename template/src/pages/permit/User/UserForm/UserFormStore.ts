import {
  RoleRtRsco,
  UserData,
  createUser,
  editUser,
  getUser,
  getUserRoleRtRoleNode,
  updateUserRole,
} from "@/services/apis/permit/user";
import { computed, makeObservable, observable } from "mobx";

import FormModalStore from "@/stores/basisStoreClass/FormModalStore";
import { ResType } from "@/services/Axios";
import { SelectOption } from "@hsu-react/ui";

class UserFormStore extends FormModalStore<UserData> {
  @computed
  get roleList() {
    return this._roleList;
  }
  @observable
  private accessor _roleList: SelectOption[] = [];

  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * 获取详情
   * @param id
   */
  protected _getFormData = (id: number | string) => {
    getUser(id).then((res) => {
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
  public addFormData = (data: UserData, fn?: (res: ResType) => void) => {
    createUser(data).then((res) => {
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
    data: UserData,
    fn?: (res: ResType) => void
  ) => {
    data.id = id;

    editUser(data).then((res) => {
      fn?.(res);

      this._message(res);
    });
  };

  /**
   * 获取角色列表
   * 获取用户角色
   * @param id
   */
  public getUserRoleRtRoleNode = (id: number | string) => {
    getUserRoleRtRoleNode({ userId: id }).then((res) => {
      const { checkedKeys, list } = res.data;
      this._roleList = list?.map((item) => ({
        label: item.nm,
        value: item.id,
      }));

      const roleIdList = checkedKeys?.map((i) => i.toString());
      this._formData = { roleIdList };
    });
  };

  /**
   * 分配用户角色
   * @param id
   * @param data
   * @param fn
   */
  public updateUserRole = (
    id: number | string,
    data: RoleRtRsco,
    fn?: (res: ResType) => void
  ) => {
    updateUserRole({ id, ...data }).then((res) => {
      if (res.code === 0) {
        fn?.(res);
      }

      this._message(res);
    });
  };
}

export default new UserFormStore();
