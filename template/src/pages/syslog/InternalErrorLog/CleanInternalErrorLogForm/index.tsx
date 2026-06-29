import React from "react";

import { FormItemProps, Form } from "@hsu-react/ui";
import CleanInternalErrorLogFormStore from "./CleanInternalErrorLogFormStore";
import { observer } from "mobx-react-lite";
import styles from "./index.module.less";

interface CleanInternalErrorLogFormProps {
  open?: boolean;
  title?: string;
  onCancel?: () => void;
  onOk?: () => void;
}

const CleanInternalErrorLogForm: React.FC<CleanInternalErrorLogFormProps> = observer(
  (props) => {
    const { open, title, onCancel, onOk } = props;
    const { resetFormData, cleanLog, formData, loading } = CleanInternalErrorLogFormStore;

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
        className={styles.CleanInternalErrorLogForm}
        title={title || "清理内部错误日志"}
        open={open}
        onCancel={onClose}
        onOk={handleOk}
        formItems={formItems}
        value={formData}
        okButtonProps={{ loading }}
      />
    );
  }
);

export default CleanInternalErrorLogForm;

