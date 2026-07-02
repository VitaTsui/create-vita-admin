import { TreeData } from "@hsu-react/ui";
import {
  DeptData,
  DeptSearchData,
  deleteDept,
  getDeptList,
} from "@/services/apis/permit/dept";

import ListPanelStore from "@/stores/basisStoreClass/ListPanelStore";
import { computed, makeObservable, observable } from "mobx";

class DeptStore extends ListPanelStore<DeptSearchData, DeptData> {
  @computed
  get deptTree() {
    return this._deptTree;
  }
  @observable
  private accessor _deptTree: TreeData[] = [];

  @computed
  get expandedIds() {
    return this._expandedIds;
  }
  @observable
  private accessor _expandedIds: string[] = [];

  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * 获取列表
   */
  protected _getDataSource = () => {
    getDeptList({ query: this._query.value })
      .then((res) => {
        if (res.code === 0) {
          const data = res.data;
          this._dataSource = data.list;

          this._deptTree = this._formatTree(
            this._dataSource as Required<DeptData>[]
          );
          this._expandedIds = this._getExpandedIds(
            this._dataSource as Required<DeptData>[]
          );
        } else {
          this._message(res);
        }

        this._isLoading = false;
      })
      .catch(() => {
        this._isLoading = false;
      });
  };
  // 格式化部门列表
  private _formatTree = (list: Required<DeptData>[]) => {
    const node: TreeData[] = [];

    list?.forEach((item) => {
      let children: TreeData[] = [];

      if (item.children) {
        children = this._formatTree(item.children);
      }

      node.push({
        title: item.nm,
        key: item.id,
        value: item.id,
        children: children.length > 0 ? children : undefined,
      });
    });

    return node;
  };
  // 获取展开Id
  private _getExpandedIds = (list: Required<DeptData>[]) => {
    const ids: string[] = [];

    list?.forEach((item) => {
      if (item.children) {
        const _ids = this._getExpandedIds(item.children);
        ids.push(item.id.toString(), ..._ids);
      }
    });

    return ids;
  };

  /**
   * 删除
   * @param id
   */
  public delData = (id: number | string) => {
    deleteDept(id).then((res) => {
      if (res.code === 0) {
        this.getDataSource();
      }

      this._message(res);
    });
  };
}

export default new DeptStore();
