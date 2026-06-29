import React, { useEffect } from "react";

import ErrorLogFormStore from "./ErrorLogFormStore";
import { Form, FormItemProps } from "@hsu-react/ui";
import { observer } from "mobx-react-lite";
import styles from "./index.module.less";

interface ErrorLogFormProps {
  open?: boolean;
  id?: string | number;
  onCancel?: () => void;
  date?: [string, string];
}

const ErrorLogForm: React.FC<ErrorLogFormProps> = observer((props) => {
  const { open, id, onCancel, date } = props;
  const { resetFormData, formData, getFormData } = ErrorLogFormStore;

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
      name: "method",
      label: "方法",
    },
    {
      type: "TEXT",
      name: "crtTm",
      label: "创建时间",
    },
    {
      type: "TEXT",
      name: "userAgent",
      label: "用户代理",
      width: "100%",
    },
    {
      type: "TEXT",
      name: "regArg",
      label: "请求参数",
      width: "100%",
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
      className={styles.ErrorLogForm}
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

export default ErrorLogForm;
