import React from "react";
import { Form as AntdForm } from "antd";
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
  const [form] = AntdForm.useForm();

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
        // 仅当确认密码字段有值时，当新密码字段变更时，触发确认密码字段的验证
        if (
          "password" in changedValues &&
          form &&
          form.getFieldValue("confirmPassword")
        ) {
          form.validateFields(["confirmPassword"]);
        }
      }}
    />
  );
};

export default ResetPasswordForm;

