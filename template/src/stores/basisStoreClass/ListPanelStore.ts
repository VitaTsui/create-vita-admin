import { computed, makeObservable, observable } from "mobx";

import Query, {
  LogicType,
  ModeType,
  OrderType,
  RuleNameType,
} from "@/services/Query";
import FormModalStore from "./FormModalStore";
import { ResType } from "@/services/Axios";
import { message, notification } from "antd";
import wsCache, { CACHE_KEY } from "@/utils/wsCache";
import { Equal } from "hsu-utils";

export type searchModeType<T> = { [K in keyof T]?: ModeType };
export type searchRNType<T> = { [K in keyof T]?: RuleNameType };
export type searchKTType<T> = { [K in keyof T]?: LogicType };

/**
 * S: 查询条件类型
 * D：列表数据类型
 */
export default class ListPanelStore<
  S = Record<string, unknown>,
  D = Record<string, unknown>
> extends FormModalStore<D> {
  // 请求
  protected accessor _query: Query = new Query();

  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * 正在加载
   */
  @computed
  get isLoading() {
    return this._isLoading;
  }
  @observable
  protected accessor _isLoading: boolean = true;

  /**
   * 排序
   */
  @computed
  get order() {
    return this._order;
  }
  @observable
  protected accessor _order: { k: string; t: OrderType } | undefined = undefined;
  protected accessor _initOrder: { k: string; t: OrderType } = {
    k: "crtTm",
    t: "desc",
  };
  public onOrderChange = (order?: { k: string; t: OrderType }) => {
    this._order =
      order ||
      (Equal.ObjEqual(this._initOrder, this._order) && !!this._order
        ? undefined
        : this._initOrder);

    this._query.toOArr(this._order ? [this._order] : []);

    this._isLoading = true;

    this.getDataSource();
  };

  /**
   * 查询
   */
  @computed
  get searchData() {
    return this._searchData;
  }
  @observable
  protected accessor _searchData: Partial<S> = {};
  protected accessor _initSearchData: Partial<S> = {};
  protected accessor _staticSearchData: Partial<S> = {};
  protected accessor _modeType: Partial<Record<keyof Partial<S>, ModeType>> =
    {};
  protected accessor _ruleName: Partial<
    Record<keyof Partial<S>, RuleNameType>
  > = {};
  protected accessor _logicType: Partial<Record<keyof Partial<S>, LogicType>> =
    {};
  public setSearchData = (searchData: Partial<S> = {}) => {
    this._searchData = {
      ...this._initSearchData,
      ...searchData,
      ...this._staticSearchData,
    };

    this._query.toF(
      this._searchData,
      this._modeType as Partial<Record<keyof S, ModeType>>,
      this._ruleName,
      this._logicType
    );

    this.changePage({ num: 1 });
  };
  public initSearchData = (searchData?: Partial<S>) => {
    if (searchData) {
      this._initSearchData = searchData;
    }

    if (!this._order) {
      this._order = this._initOrder;
    }
    if (this._order) {
      this._query.toOArr([this._order]);
    }

    setTimeout(() => {
      this.setSearchData(this._initSearchData);
    }, 500);
  };

  /**
   * 分页
   */
  @computed
  get page() {
    return this._page;
  }
  @observable
  protected accessor _page: { num: number; size: number } = {
    num: 1,
    size: wsCache.get(CACHE_KEY.PAGE_SIZE)?.[window.location.pathname] || 20,
  };
  protected accessor _c: 1 | 0 = 0;
  public changePage = (
    page: { num?: number; size?: number },
    search: boolean = true
  ) => {
    if (!search) {
      this._page = { ...this._page, ...page };

      return;
    }

    this._isLoading = true;

    this._page = { ...this._page, ...page };

    wsCache.set(CACHE_KEY.PAGE_SIZE, {
      ...(wsCache.get(CACHE_KEY.PAGE_SIZE) || {}),
      [window.location.pathname]: this._page.size,
    });

    this._query.toP(this._page.num, this._page.size, this._c);

    this.getDataSource();
  };
  public resetPage = () => {
    this.changePage({ num: 1 });
  };
  public onShowSizeChange = (page: { num?: number; size?: number }) => {
    this._page = { ...this._page, ...page };
  };

  /**
   * 列表
   */
  @computed
  get total() {
    return this._total;
  }
  @observable
  protected accessor _total: number = 0;
  @computed
  get dataSource(): Array<D> {
    return this._dataSource;
  }
  @observable
  protected accessor _dataSource: Array<D> = [];
  public getDataSource = () => {
    // 每次请求前先置空列表数据，避免展示上一次的旧数据
    this._dataSource = [];

    this._getDataSource();
  };
  protected _getDataSource = () => {
    // 由子类实现具体的数据获取逻辑
  };

  /**
   * 删除
   * @param id
   */
  public delData = (_id: number | string) => {
    // 由子类实现具体的删除逻辑
  };

  /**
   * 导入文件
   * @param file
   */
  public uploadList = (_file: FormData) => {
    // 由子类实现具体的导入逻辑
  };

  /**
   * 消息处理
   * @param res
   */
  protected _message = (res?: ResType) => {
    if (res?.code === 0) {
      if (typeof res?.data === "string") {
        notification.success({
          message: res.data,
        });
      } else {
        message.success(res?.msg ?? "成功");
      }
    } else {
      notification.error({
        message: res?.msg ?? "失败",
      });
    }
  };

  /**
   * 重置Store
   */
  public resetStore = () => {
    this._searchData = {};
    this._order = undefined;
    this._page = {
      num: 1,
      size: wsCache.get(CACHE_KEY.PAGE_SIZE)?.[window.location.pathname] || 20,
    };
    this._dataSource = [];
    this._total = 0;
    this._isLoading = true;
    this._query.clear();

    this.resetFormData();

    this._resetStore();
  };
  protected _resetStore = () => {};
}
