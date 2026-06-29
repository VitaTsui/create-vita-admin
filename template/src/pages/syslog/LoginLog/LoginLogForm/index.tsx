import React, { useEffect } from "react";

import { FormItemProps, Form } from "@hsu-react/ui";
import LoginLogFormStore from "./LoginLogFormStore";
import { observer } from "mobx-react-lite";
import styles from "./index.module.less";

interface LoginLogFormProps {
  open?: boolean;
  title?: string;
  id?: string | number;
  onCancel?: () => void;
  onOk?: () => void;
  date?: [string, string];
}

const LoginLogForm: React.FC<LoginLogFormProps> = observer((props) => {
  const { open, id, onCancel, date } = props;
  const { resetFormData, formData, getFormData } = LoginLogFormStore;

  useEffect(() => {
    if (id && date && open) {
      getFormData(id, { crtTm: date });
    }
  }, [date, getFormData, id, open]);

  const formItems: FormItemProps[] = [
    {
      type: "TEXT",
      name: "username",
      label: "用户名",
    },
    {
      type: "TEXT",
      name: "ip",
      label: "IP",
    },
    {
      type: "TEXT",
      name: "uri",
      label: "URI",
    },
    {
      type: "TEXT",
      name: "typeDsr",
      label: "类型",
    },
    {
      type: "TEXT",
      name: "statusDsr",
      label: "状态",
    },
    {
      type: "TEXT",
      name: "crtTm",
      label: "创建时间",
    },
    {
      type: "TEXT",
      name: "errInfo",
      label: "错误信息",
      width: "100%",
    },
  ];

  const onClose = () => {
    resetFormData();
    onCancel?.();
  };

  return (
    <Form.Modal
      className={styles.LoginLogForm}
      title="日志详情"
      open={open}
      onCancel={() => {
        onClose();
      }}
      formItems={formItems}
      value={formData}
      footer={false}
      layout="horizontal"
    />
  );
});

export default LoginLogForm;
