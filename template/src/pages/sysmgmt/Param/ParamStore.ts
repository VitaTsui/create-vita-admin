import {
  ParamData,
  ParamSearchData,
  deleteParam,
  getParamList,
} from "@/services/apis/sysmgmt/param";

import ListPanelStore from "@/stores/basisStoreClass/ListPanelStore";
import { makeObservable } from "mobx";

class ParamStore extends ListPanelStore<ParamSearchData, ParamData> {
  // sys_param 无 type 列，按编码/值模糊检索即可（不得注入 type 过滤，否则后端 SQL 报错）
  protected accessor _modeType = {
    cd: "LK",
    val: "LK",
  };

  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * 获取列表
   */
  protected _getDataSource = () => {
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
   * 删除
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
