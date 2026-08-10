import { getEnum, getRoleList, getUserList } from "@/services/apis/enum";
import { SelectOption } from "@hsu-react/ui";
import { makeAutoObservable } from "mobx";

/**
 * Permission-related option methods
 */
export default class PermitMethods {
  // Role
  private _role: SelectOption[] = [];
  // Role type
  private _roleType: SelectOption[] = [];
  // User
  private _user: SelectOption[] = [];
  // Whether data is masked
  private _maskStatus: SelectOption[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Role
  public getRole = () => {
    getRoleList().then((res) => {
      if (res.code === 0) {
        const { list } = res.data;
        this._role = list?.map((item) => ({
          label: item.nm,
          value: item.id,
        }));
      }
    });
  };

  // Role type
  public getRoleType = () => {
    getEnum("SysUserEn$Type").then((res) => {
      if (res.code === 0) {
        const { list = [] } = res.data;
        this._roleType = list?.map((item) => ({
          label: item.nm,
          value: item.cd,
        }));
      }
    });
  };

  // User
  public getUser = () => {
    getUserList().then((res) => {
      if (res.code === 0) {
        const { list = [] } = res.data;
        this._user = list?.map((item) => ({
          label: item.nickname,
          value: item.id,
        }));
      }
    });
  };

  // Whether data is masked
  public getMaskStatus = () => {
    getEnum("SysRoleDataLevelScopeEn$MaskStatus").then((res) => {
      if (res.code === 0) {
        const { list } = res.data;
        this._maskStatus = list?.map((item) => ({
          label: item.nm,
          value: item.cd,
        }));
      }
    });
  };

  // Getters
  get role() {
    return this._role;
  }
  get roleType() {
    return this._roleType;
  }
  get user() {
    return this._user;
  }
  get maskStatus() {
    return this._maskStatus;
  }
}
