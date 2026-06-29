import React, { useEffect } from "react";

import ApiLogFormStore from "./ApiLogFormStore";
import { Form, FormItemProps } from "@hsu-react/ui";
import { observer } from "mobx-react-lite";
import styles from "./index.module.less";

interface ApiLogFormProps {
  open?: boolean;
  id?: string | number;
  onCancel?: () => void;
  date?: [string, string];
}

const ApiLogForm: React.FC<ApiLogFormProps> = observer((props) => {
  const { open, id, onCancel, date } = props;
  const { resetFormData, formData, getFormData } = ApiLogFormStore;

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
      name: "nm",
      label: "接口名称",
    },
    {
      type: "TEXT",
      name: "uri",
      label: "URI",
    },
    {
      type: "TEXT",
      name: "ip",
      label: "IP",
    },
    {
      type: "TEXT",
      name: "statusDsr",
      label: "状态",
    },
    {
      type: "TEXT",
      name: "method",
      label: "方法",
    },
    {
      type: "TEXT",
      name: "channel",
      label: "渠道",
    },
    {
      type: "TEXT",
      name: "crtTm",
      label: "创建时间",
    },
    {
      type: "TEXT",
      name: "spendTime",
      label: "运行时长(ms)",
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
      name: "result",
      label: "结果",
      width: "100%",
    },
  ];

  const onClose = () => {
    resetFormData();
    onCancel?.();
  };

  return (
    <Form.Modal
      className={styles.ApiLogForm}
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

export default ApiLogForm;
