import React from "react";

import { FormItemProps, Form } from "@hsu-react/ui";
import CleanOprLogFormStore from "./CleanOprLogFormStore";
import { observer } from "mobx-react-lite";
import styles from "./index.module.scss";

interface CleanOprLogFormProps {
  open?: boolean;
  title?: string;
  onCancel?: () => void;
  onOk?: () => void;
}

const CleanOprLogForm: React.FC<CleanOprLogFormProps> = observer((props) => {
  const { open, title, onCancel, onOk } = props;
  const { resetFormData, cleanLog, formData, loading } = CleanOprLogFormStore;

  const formItems: FormItemProps[] = [
    {
      type: "INPUTNUMBER",
      name: "retentionPeriod",
      label: "保留期限",
      required: true,
      componentProps: {
        suffix: "天",
        min: 0,
      },
    },
  ];

  const onClose = () => {
    resetFormData();
    onCancel?.();
  };

  const handleOk = (data: Record<string, unknown>) => {
    cleanLog(data.retentionPeriod as string, () => {
      onClose();
      onOk?.();
    });
  };

  return (
    <Form.Modal
      className={styles.CleanOprLogForm}
      title={title || "清理操作日志"}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      formItems={formItems}
      value={formData}
      okButtonProps={{ loading }}
    />
  );
});

export default CleanOprLogForm;
