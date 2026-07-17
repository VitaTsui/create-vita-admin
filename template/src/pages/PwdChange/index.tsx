import { Form, FormItemProps } from "@hsu-react/ui";
import { Password } from "@hsu-react/ui/es/components/FormItem/rules";
import PwdChangeStore from "./PwdChangeStore";
import React from "react";
import { observer } from "mobx-react-lite";
import styles from "./index.module.scss";

interface PwdChangeProps {
  open?: boolean;
  onCancel?: () => void;
  onOk?: () => void;
}

const PwdChange: React.FC<PwdChangeProps> = observer((props) => {
  const { open, onCancel, onOk } = props;
  const { resetFormData, editFormData, formData } = PwdChangeStore;
  const [form] = Form.useForm();

  const formItems: FormItemProps[] = [
    {
      type: "PASSWORD",
      label: "旧密码",
      name: "oldPassword",
      required: true,
      componentProps: {
        className: styles.input,
        placeholder: "请输入旧密码",
      },
    },
    {
      type: "PASSWORD",
      label: "新密码",
      name: "password",
      required: true,
      rules: [Password],
      componentProps: {
        className: styles.input,
        placeholder: "请输入新密码",
      },
    },
    {
      type: "PASSWORD",
      label: "确认密码",
      name: "confirmPassword",
      required: true,
      rules: [
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue("password") === value) {
              return Promise.resolve();
            }
            return Promise.reject("两次密码输入不一致");
          },
        }),
      ],
      componentProps: {
        className: styles.input,
        placeholder: "请再次输入新密码",
      },
    },
  ];

  const onClose = () => {
    resetFormData();
    onCancel?.();
  };

  const handleOk = (data: Record<string, unknown>) => {
    delete data.confirmPassword;
    editFormData("", data, () => {
      onClose();
      onOk?.();
    });
  };

  const handleValuesChange = (changedValues: Record<string, unknown>) => {
    // Only when the confirm-password field has a value: re-validate it when the new-password field changes
    if (
      "password" in changedValues &&
      form &&
      form.getFieldValue("confirmPassword")
    ) {
      // A mismatch makes validateFields reject — which is the whole point of this
      // cross-field check. antd already renders the error on the field, so swallow
      // the rejection; leaving it unhandled surfaces as an unhandled rejection.
      form.validateFields(["confirmPassword"]).catch(() => void 0);
    }
  };

  return (
    <Form.Modal
      className={styles.PwdChange}
      title="修改密码"
      open={open}
      onCancel={() => {
        onClose();
      }}
      onOk={handleOk}
      formItems={formItems}
      value={formData}
      externalForm={form}
      onValuesChange={handleValuesChange}
    />
  );
});

export default PwdChange;
