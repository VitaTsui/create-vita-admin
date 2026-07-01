import {
  InputTypeRule,
  LengthRule,
  Password,
  PhoneRule,
} from "@hsu-react/ui/es/components/FormItem/rules";
import React, { useEffect } from "react";
import { Form as AntdForm } from "antd";

import { Form, FormItemProps } from "@hsu-react/ui";
import UserFormStore from "./UserFormStore";
import { observer } from "mobx-react-lite";
import styles from "./index.module.scss";

interface UserFormProps {
  open?: boolean;
  title?: string;
  id?: string | number;
  onCancel?: () => void;
  onOk?: () => void;
  type?: "add" | "edit" | "role";
}

const UserForm: React.FC<UserFormProps> = observer((props) => {
  const { open, title, id, onCancel, onOk, type = "add" } = props;
  const {
    resetFormData,
    addFormData,
    editFormData,
    formData,
    getFormData,
    roleList,
    getUserRoleRtRoleNode,
    updateUserRole,
  } = UserFormStore;
  const [form] = AntdForm.useForm();

  useEffect(() => {
    if (id && open) {
      if (type === "edit") {
        getFormData(id);
      }

      if (type === "role") {
        getUserRoleRtRoleNode(id);
      }
    }
  }, [getFormData, getUserRoleRtRoleNode, id, open, type]);

  const formItems: Record<string, FormItemProps[]> = {
    add: [
      {
        type: "INPUT",
        name: "username",
        label: "登录账户名",
        required: true,
        rules: [
          LengthRule(),
          InputTypeRule(/^[a-zA-Z0-9]+$/, "请输入字母或数字"),
        ],
      },
      {
        type: "PASSWORD",
        name: "password",
        label: "账户密码",
        required: true,
        rules: [Password],
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
      {
        type: "INPUT",
        name: "nickname",
        label: "用户名称",
        required: true,
        rules: [LengthRule()],
      },
      {
        type: "INPUTNUMBER",
        name: "phone",
        label: "移动电话",
        rules: [PhoneRule],
      },
      {
        type: "INPUT",
        name: "email",
        label: "邮箱",
        rules: [{ type: "email", message: "请输入正确的邮箱地址" }],
      },
    ],
    edit: [
      {
        type: "INPUT",
        name: "nickname",
        label: "用户姓名",
        required: true,
        rules: [LengthRule()],
      },
      {
        type: "INPUTNUMBER",
        name: "phone",
        label: "移动电话",
        rules: [PhoneRule],
      },
      {
        type: "INPUT",
        name: "email",
        label: "邮箱",
        rules: [{ type: "email", message: "请输入正确的邮箱地址" }],
      },
    ],
    role: [
      {
        type: "SELECT",
        name: "roleIdList",
        label: "角色",
        required: true,
        componentProps: {
          mode: "tags",
          options: roleList,
        },
      },
    ],
  };

  const onClose = () => {
    resetFormData();
    onCancel?.();
  };

  const handleOk = (data: Record<string, unknown>) => {
    delete data.confirmPassword;
    if (id) {
      if (type === "edit") {
        editFormData(id, data, () => {
          onClose();
          onOk?.();
        });
      }

      if (type === "role") {
        updateUserRole(id, data, () => {
          onClose();
          onOk?.();
        });
      }
    } else {
      addFormData(data, () => {
        onClose();
        onOk?.();
      });
    }
  };

  const handleValuesChange = (changedValues: Record<string, unknown>) => {
    // 仅当确认密码字段有值时，当密码字段变更时，触发确认密码字段的验证
    if (
      "password" in changedValues &&
      form &&
      form.getFieldValue("confirmPassword")
    ) {
      form.validateFields(["confirmPassword"]);
    }
  };

  return (
    <Form.Modal
      className={styles.UserForm}
      title={title}
      open={open}
      onCancel={() => {
        onClose();
      }}
      onOk={handleOk}
      formItems={formItems[type]}
      value={formData}
      externalForm={form}
      onValuesChange={handleValuesChange}
    />
  );
});

export default UserForm;
