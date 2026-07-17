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
  // List request sequence, used to drop out-of-order stale responses
  private _listSeq = 0;

  public getDataSource = () => {
    // With two searches in a row, a slower earlier response would otherwise
    // overwrite the later one, leaving the table on the previous keyword's data.
    // Only accept the response of the most recent request.
    const seq = ++this._listSeq;

    getUserList({ query: this._query.value })
      .then((res) => {
        if (this._listSeq !== seq) {
          return;
        }
        if (res.code === 0) {
          // data may be incomplete when the backend misbehaves; guard the
          // destructuring so a malformed payload cannot blank the whole page
          const { list, page } = res.data ?? {};

          this._dataSource = list ?? [];
          this._total = page?.total ?? 0;
        } else {
          this._message(res);
        }

        this._isLoading = false;
      })
      .catch(() => {
        if (this._listSeq !== seq) {
          return;
        }
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
