import {
  ParamData,
  ParamSearchData,
  deleteParam,
  getParamList,
} from "@/services/apis/sysmgmt/param";

import ListPanelStore from "@/stores/basisStoreClass/ListPanelStore";
import { makeObservable } from "mobx";

class ParamStore extends ListPanelStore<ParamSearchData, ParamData> {
  // sys_param has no type column; fuzzy search by code/value is enough (do not inject a type filter, or the backend SQL errors)
  protected accessor _modeType = {
    cd: "LK",
    val: "LK",
  };

  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * Fetch list
   */
  public getDataSource = () => {
    getParamList({ query: this._query.value })
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
    deleteParam(id).then((res) => {
      if (res.code === 0) {
        this.getDataSource();
      }

      this._message(res);
    });
  };
}

export default new ParamStore();
