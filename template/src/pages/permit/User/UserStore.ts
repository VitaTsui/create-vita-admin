import {
  UserData,
  UserSearchData,
  deleteUser,
  getUserList,
  resetUserPwd,
  updateUserStatus,
} from "@/services/apis/permit/user";

import ListPanelStore from "@/stores/basisStoreClass/ListPanelStore";
import { makeObservable } from "mobx";

class UserStore extends ListPanelStore<UserSearchData, UserData> {
  protected accessor _ruleName = {
    crtTm: "a1",
    status: "a1",
    type: "a1",
    username__phone__email__nickname__id: "b1",
  };

  protected accessor _modeType = {
    username__phone__email: "LK",
    crtTm: "BT",
    status: "EQ",
    type: "EQ",
  };

  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * Fetch list
   */
  public getDataSource = () => {
    getUserList({ query: this._query.value })
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
   * Delete
   * @param id
   */
  public delData = (id: number | string) => {
    deleteUser(id).then((res) => {
      if (res.code === 0) {
        this.getDataSource();
      }

      this._message(res);
    });
  };

  /**
   * Update status
   * @param id
   * @param status
   */
  public updateUserStatus = (id: number | string, status: number) => {
    updateUserStatus(id, status).then((res) => {
      if (res.code === 0) {
        this.getDataSource();
      }

      this._message(res);
    });
  };

  /**
   * Reset password
   * @param id
   */
  public resetUserPwd = (
    id: number | string,
    password: string,
    fn?: () => void
  ) => {
    resetUserPwd({ id, password }).then((res) => {
      this._message(res);

      if (res.code === 0) {
        fn?.();
      }
    });
  };
}

export default new UserStore();
