import { ResType } from "@/services/Axios";
import { message, notification } from "antd";
import { computed, makeObservable, observable } from "mobx";

/**
 * F: form data type
 */
class FormModalStore<F = Record<string, unknown>> {
  constructor() {
    makeObservable(this);
  }

  /**
   * Form data
   */
  @computed
  get formData(): Partial<F> {
    return this._formData;
  }
  @observable
  protected accessor _formData: Partial<F> = {};

  /**
   * Form type
   */
  @computed
  get formType(): string {
    return this._formType;
  }
  @observable
  protected accessor _formType: string = "def";
  public setFormType = (formType: string) => {
    this._formType = formType;
  };

  /**
   * Get the detail
   * @param id
   */
  public getFormData = (id: number | string, data?: Partial<F>) => {
    setTimeout(() => {
      this._getFormData(id, data);
    }, 500);
  };
  protected _getFormData = (_id: number | string, _data?: Partial<F>) => {
    // Concrete fetch logic is implemented by subclasses
  };

  /**
   * Edit
   * @param data
   */
  public editFormData = (
    _id: number | string,
    _data: Partial<F>,
    fn?: () => void
  ) => {
    // Concrete edit logic is implemented by subclasses
    fn?.();
  };

  /**
   * Create
   * @param data
   */
  public addFormData = (_data: Partial<F>, fn?: () => void) => {
    // Concrete create logic is implemented by subclasses
    fn?.();
  };

  /**
   * Reset the form data
   */
  public resetFormData = () => {
    this._formData = {};
  };

  /**
   * Message handling
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
   * Reset the store
   */
  public resetStore = () => {
    this._formData = {};

    this._resetStore();
  };

  protected _resetStore = () => {};
}

export default FormModalStore;
