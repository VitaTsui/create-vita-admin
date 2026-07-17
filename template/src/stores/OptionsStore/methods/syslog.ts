import { SelectOption } from "@hsu-react/ui";
import { getEnum } from "@/services/apis/enum";
import { makeAutoObservable } from "mobx";

/**
 * System-log-related option methods
 */
export default class SyslogMethods {
  // Login log status
  private _loginLogStatus: SelectOption[] = [];
  // Job log status
  private _jobLogStatus: SelectOption[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Login log status
  public getLoginLogStatus = () => {
    getEnum("SysLogLoginEn$Status").then((res) => {
      if (res.code === 0) {
        const { list } = res.data;
        this._loginLogStatus = list?.map((item) => ({
          label: item.nm,
          value: item.cd,
        }));
      }
    });
  };

  // Job log status
  public getJobLogStatus = () => {
    getEnum("SysJobLogEn$Status").then((res) => {
      if (res.code === 0) {
        const { list } = res.data;
        this._jobLogStatus = list?.map((item) => ({
          label: item.nm,
          value: item.cd,
        }));
      }
    });
  };

  // Getters
  get loginLogStatus() {
    return this._loginLogStatus;
  }
  get jobLogStatus() {
    return this._jobLogStatus;
  }
}
