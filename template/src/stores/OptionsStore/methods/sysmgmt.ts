import {
  getEnum,
  getSmsConfigList,
  getSmsTemplateList,
} from "@/services/apis/enum";
import { SelectOption } from "@hsu-react/ui";
import { makeAutoObservable } from "mobx";

/**
 * System-management-related option methods
 */
export default class SysmgmtMethods {
  // Menu category
  private _menuCat: SelectOption[] = [];
  // Menu type
  private _menuType: SelectOption[] = [];
  // File config status
  private _fileConfigStatus: SelectOption[] = [];
  // File config type
  private _fileConfigType: SelectOption[] = [];
  // File config environment
  private _fileConfigActive: SelectOption[] = [];
  // SMS config environment
  private _smsConfigActive: SelectOption[] = [];
  // SMS config type
  private _smsConfigType: SelectOption[] = [];
  // SMS config status
  private _smsConfigStatus: SelectOption[] = [];
  // SMS template type
  private _smsTemplateType: SelectOption[] = [];
  // SMS log status
  private _smsLogStatus: SelectOption[] = [];
  // SMS config list
  private _smsConfigList: SelectOption[] = [];
  // SMS template list
  private _smsTemplateList: SelectOption[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Menu category
  public getMenuCat = () => {
    getEnum("SysRscoEn$Cat").then((res) => {
      if (res.code === 0) {
        const { list } = res.data;
        this._menuCat = list?.map((item) => ({
          label: item.nm,
          value: item.cd,
        }));
      }
    });
  };

  // Menu type
  public getMenuType = () => {
    getEnum("SysRscoEn$Type").then((res) => {
      if (res.code === 0) {
        const { list } = res.data;
        this._menuType = list?.map((item) => ({
          label: item.nm,
          value: item.cd,
        }));
      }
    });
  };

  // File config status
  public getFileConfigStatus = () => {
    getEnum("SysFileConfEn$Status").then((res) => {
      if (res.code === 0) {
        const { list } = res.data;
        this._fileConfigStatus = list?.map((item) => ({
          label: item.nm,
          value: item.cd,
        }));
      }
    });
  };

  // File config type
  public getFileConfigType = () => {
    getEnum("SysFileConfEn$Type").then((res) => {
      if (res.code === 0) {
        const { list } = res.data;
        this._fileConfigType = list?.map((item) => ({
          label: item.nm,
          value: item.cd,
        }));
      }
    });
  };

  // File config environment
  public getFileConfigActive = () => {
    getEnum("SysFileConfEn$Active").then((res) => {
      if (res.code === 0) {
        const { list } = res.data;
        this._fileConfigActive = list?.map((item) => ({
          label: item.nm,
          value: item.cd,
        }));
      }
    });
  };

  // SMS config environment
  public getSmsConfigActive = () => {
    getEnum("SysSmsConfEn$Active").then((res) => {
      if (res.code === 0) {
        const { list } = res.data;
        this._smsConfigActive = list?.map((item) => ({
          label: item.nm,
          value: item.cd,
        }));
      }
    });
  };

  // SMS config type
  public getSmsConfigType = () => {
    getEnum("SysSmsConfEn$Type").then((res) => {
      if (res.code === 0) {
        const { list } = res.data;
        this._smsConfigType = list?.map((item) => ({
          label: item.nm,
          value: item.cd,
        }));
      }
    });
  };

  // SMS config status
  public getSmsConfigStatus = () => {
    getEnum("SysSmsConfEn$Status").then((res) => {
      if (res.code === 0) {
        const { list } = res.data;
        this._smsConfigStatus = list?.map((item) => ({
          label: item.nm,
          value: item.cd,
        }));
      }
    });
  };

  // SMS template type
  public getSmsTemplateType = () => {
    getEnum("SysSmsTemplateEn$Type").then((res) => {
      if (res.code === 0) {
        const { list } = res.data;
        this._smsTemplateType = list?.map((item) => ({
          label: item.nm,
          value: item.cd,
        }));
      }
    });
  };

  // SMS log status
  public getSmsLogStatus = () => {
    getEnum("SysSmsLogEn$Status").then((res) => {
      if (res.code === 0) {
        const { list } = res.data;
        this._smsLogStatus = list?.map((item) => ({
          label: item.nm,
          value: item.cd,
        }));
      }
    });
  };

  // SMS config list
  public getSmsConfigList = () => {
    getSmsConfigList().then((res) => {
      if (res.code === 0) {
        const { list } = res.data;
        this._smsConfigList = list?.map((item) => ({
          ...item,
          label: item.nm,
          value: item.id,
        }));
      }
    });
  };

  // SMS template list
  public getSmsTemplateList = () => {
    getSmsTemplateList().then((res) => {
      if (res.code === 0) {
        const { list } = res.data;
        this._smsTemplateList = list?.map((item) => ({
          ...item,
          label: item.nm,
          value: item.cd,
        }));
      }
    });
  };

  // Getters
  get menuCat() {
    return this._menuCat;
  }
  get menuType() {
    return this._menuType;
  }
  get fileConfigStatus() {
    return this._fileConfigStatus;
  }
  get fileConfigType() {
    return this._fileConfigType;
  }
  get fileConfigActive() {
    return this._fileConfigActive;
  }
  get smsConfigActive() {
    return this._smsConfigActive;
  }
  get smsConfigType() {
    return this._smsConfigType;
  }
  get smsConfigStatus() {
    return this._smsConfigStatus;
  }
  get smsTemplateType() {
    return this._smsTemplateType;
  }
  get smsLogStatus() {
    return this._smsLogStatus;
  }
  get smsConfigList() {
    return this._smsConfigList;
  }
  get smsTemplateList() {
    return this._smsTemplateList;
  }
}
