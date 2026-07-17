import { makeAutoObservable } from "mobx";
import { SelectOption } from "@hsu-react/ui";

// Import the method classes of each feature module
import PermitMethods from "./methods/permit";
import SysmgmtMethods from "./methods/sysmgmt";
import SyslogMethods from "./methods/syslog";

/**
 * @param MENU_CAT menu category
 * @param MENU_TYPE menu type
 * @param ROLE role
 * @param ROLE_TYPE role type
 * @param USER user
 * @param MASK_STATUS whether data is masked
 * @param FILE_CONFIG_STATUS file config status
 * @param FILE_CONFIG_TYPE file config type
 * @param FILE_CONFIG_ACTIVE file config environment
 * @param SMS_CONFIG_ACTIVE SMS config environment
 * @param SMS_CONFIG_TYPE SMS config type
 * @param SMS_CONFIG_STATUS SMS config status
 * @param SMS_TEMPLATE_TYPE SMS template type
 * @param SMS_LOG_STATUS SMS log status
 * @param SMS_CONFIG_LIST SMS config list
 * @param SMS_TEMPLATE_LIST SMS template list
 * @param LOGIN_LOG_STATUS login log status
 * @param JOB_LOG_STATUS job log status
 * @param LARGE_MODEL_API_KEY_LIST LLM API_KEY list (placeholder; the template has no real LLM wired in, extend it yourself)
 */
export type OptionsType =
  | "MENU_CAT"
  | "MENU_TYPE"
  | "ROLE"
  | "ROLE_TYPE"
  | "USER"
  | "MASK_STATUS"
  | "FILE_CONFIG_STATUS"
  | "FILE_CONFIG_TYPE"
  | "FILE_CONFIG_ACTIVE"
  | "SMS_CONFIG_ACTIVE"
  | "SMS_CONFIG_TYPE"
  | "SMS_CONFIG_STATUS"
  | "SMS_TEMPLATE_TYPE"
  | "SMS_LOG_STATUS"
  | "SMS_CONFIG_LIST"
  | "SMS_TEMPLATE_LIST"
  | "LOGIN_LOG_STATUS"
  | "JOB_LOG_STATUS"
  | "LARGE_MODEL_API_KEY_LIST";

class CommonOptions {
  private permitMethods: PermitMethods;
  private sysmgmtMethods: SysmgmtMethods;
  private syslogMethods: SyslogMethods;

  constructor() {
    this.permitMethods = new PermitMethods();
    this.sysmgmtMethods = new SysmgmtMethods();
    this.syslogMethods = new SyslogMethods();

    makeAutoObservable(this);
  }

  // System management methods - delegated to SysmgmtMethods
  public getMenuCat = () => this.sysmgmtMethods.getMenuCat();
  public getMenuType = () => this.sysmgmtMethods.getMenuType();
  public getFileConfigStatus = () => this.sysmgmtMethods.getFileConfigStatus();
  public getFileConfigType = () => this.sysmgmtMethods.getFileConfigType();
  public getFileConfigActive = () => this.sysmgmtMethods.getFileConfigActive();
  public getSmsConfigActive = () => this.sysmgmtMethods.getSmsConfigActive();
  public getSmsConfigType = () => this.sysmgmtMethods.getSmsConfigType();
  public getSmsConfigStatus = () => this.sysmgmtMethods.getSmsConfigStatus();
  public getSmsTemplateType = () => this.sysmgmtMethods.getSmsTemplateType();
  public getSmsLogStatus = () => this.sysmgmtMethods.getSmsLogStatus();
  public getSmsConfigList = () => this.sysmgmtMethods.getSmsConfigList();
  public getSmsTemplateList = () => this.sysmgmtMethods.getSmsTemplateList();

  // Permission methods - delegated to PermitMethods
  public getRole = () => this.permitMethods.getRole();
  public getRoleType = () => this.permitMethods.getRoleType();
  public getUser = () => this.permitMethods.getUser();
  public getMaskStatus = () => this.permitMethods.getMaskStatus();

  // System log methods - delegated to SyslogMethods
  public getLoginLogStatus = () => this.syslogMethods.getLoginLogStatus();
  public getJobLogStatus = () => this.syslogMethods.getJobLogStatus();

  // LLM API_KEY list (placeholder implementation: the template has no real LLM wired in; when ChatModal under syslog references this item, no request is made)
  public getLargeModelApiKeyList = () => undefined;

  public options = (optionsType: OptionsType): SelectOption[] => {
    switch (optionsType) {
      case "MENU_CAT":
        return this.sysmgmtMethods.menuCat;
      case "MENU_TYPE":
        return this.sysmgmtMethods.menuType;
      case "ROLE":
        return this.permitMethods.role;
      case "ROLE_TYPE":
        return this.permitMethods.roleType;
      case "USER":
        return this.permitMethods.user;
      case "MASK_STATUS":
        return this.permitMethods.maskStatus;
      case "FILE_CONFIG_STATUS":
        return this.sysmgmtMethods.fileConfigStatus;
      case "FILE_CONFIG_TYPE":
        return this.sysmgmtMethods.fileConfigType;
      case "FILE_CONFIG_ACTIVE":
        return this.sysmgmtMethods.fileConfigActive;
      case "SMS_CONFIG_ACTIVE":
        return this.sysmgmtMethods.smsConfigActive;
      case "SMS_CONFIG_TYPE":
        return this.sysmgmtMethods.smsConfigType;
      case "SMS_CONFIG_STATUS":
        return this.sysmgmtMethods.smsConfigStatus;
      case "SMS_TEMPLATE_TYPE":
        return this.sysmgmtMethods.smsTemplateType;
      case "SMS_LOG_STATUS":
        return this.sysmgmtMethods.smsLogStatus;
      case "SMS_CONFIG_LIST":
        return this.sysmgmtMethods.smsConfigList;
      case "SMS_TEMPLATE_LIST":
        return this.sysmgmtMethods.smsTemplateList;
      case "LOGIN_LOG_STATUS":
        return this.syslogMethods.loginLogStatus;
      case "JOB_LOG_STATUS":
        return this.syslogMethods.jobLogStatus;
      case "LARGE_MODEL_API_KEY_LIST":
        return [];
      default:
        return [];
    }
  };
}

const OptionsStore = new CommonOptions();

export const Options = OptionsStore.options;

export default OptionsStore;
