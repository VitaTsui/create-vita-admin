import React from "react";

import { FormItemProps, Form } from "@hsu-react/ui";
import CleanApiLogFormStore from "./CleanApiLogFormStore";
import { observer } from "mobx-react-lite";
import styles from "./index.module.less";

interface CleanApiLogFormProps {
  open?: boolean;
  title?: string;
  onCancel?: () => void;
  onOk?: () => void;
}

const CleanApiLogForm: React.FC<CleanApiLogFormProps> = observer((props) => {
  const { open, title, onCancel, onOk } = props;
  const { resetFormData, cleanLog, formData, loading } = CleanApiLogFormStore;

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
      className={styles.CleanApiLogForm}
      title={title || "清理接口日志"}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      formItems={formItems}
      value={formData}
      okButtonProps={{ loading }}
    />
  );
});

export default CleanApiLogForm;
