import React from "react";
import { FormItemProps, Form } from "@hsu-react/ui";

interface ResetPasswordFormProps {
  open: boolean;
  id: string;
  onCancel: () => void;
  onOk: (id: string, password: string, callback: () => void) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  open,
  id,
  onCancel,
  onOk,
}) => {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleOk = (data: Record<string, unknown>) => {
    delete data.confirmPassword;
    if (typeof data.password === "string") {
      onOk(id, data.password, () => {
        form.resetFields();
        handleCancel();
      });
    }
  };

  const formItems: FormItemProps[] = [
    {
      type: "PASSWORD",
      name: "password",
      label: "新密码",
      rules: [{ required: true, message: "请输入密码" }],
    },
    {
      type: "PASSWORD",
      name: "confirmPassword",
      label: "确认密码",
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
    },
  ];

  return (
    <Form.Modal
      open={open}
      title="重置密码"
      onCancel={handleCancel}
      onOk={handleOk}
      formItems={formItems}
      externalForm={form}
      onValuesChange={(changedValues) => {
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
      }}
    />
  );
};

export default ResetPasswordForm;

