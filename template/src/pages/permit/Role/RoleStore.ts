import {
  RolePermissionsData,
  RolePermissionsSearchData,
  deleteRolePermissions,
  getRolePermissionsList,
} from "@/services/apis/permit/Role/role";

import ListPanelStore from "@/stores/basisStoreClass/ListPanelStore";
import { makeObservable } from "mobx";

class RolePermissionsStore extends ListPanelStore<
  RolePermissionsSearchData,
  RolePermissionsData
> {
  protected accessor _ruleName = {
    type: "al",
    cd__nm: "b1",
  };

  protected accessor _modeType = {
    type: "EQ",
    cd__nm: "LK",
  };

  constructor() {
    super();
    makeObservable(this);
  }
  /**
   * 获取列表
   */
  public getDataSource = () => {
    getRolePermissionsList({ query: this._query.value })
      .then((res) => {
        if (res.code === 0) {
          const { list, page } = res.data;
          const { total } = page;

          this._dataSource = list;
          this._total = total;
        } else {
          this._message(res);
        }

        this._isLoading = false;
      })
      .catch(() => {
        this._isLoading = false;
      });
  };

  /**
   * 删除
   * @param id
   */
  public delData = (id: number | string) => {
    deleteRolePermissions(id).then((res) => {
      if (res.code === 0) {
        this.getDataSource();
      }

      this._message(res);
    });
  };
}

export default new RolePermissionsStore();
