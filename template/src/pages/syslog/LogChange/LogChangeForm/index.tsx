import React, { useEffect } from "react";

import { FormItemProps, Form } from "@hsu-react/ui";
import LogChangeFormStore from "./LogChangeFormStore";
import { observer } from "mobx-react-lite";
import styles from "./index.module.less";

interface LogChangeFormProps {
  open?: boolean;
  title?: string;
  id?: string | number;
  onCancel?: () => void;
  onOk?: () => void;
}

const LogChangeForm: React.FC<LogChangeFormProps> = observer((props) => {
  const { open, title, id, onCancel, onOk } = props;
  const { resetFormData, formData, getFormData, addFormData, editFormData } =
    LogChangeFormStore;

  useEffect(() => {
    if (id && open) {
      getFormData(id);
    }
  }, [getFormData, id, open]);

  const formItems: FormItemProps[] = [
    {
      type: "INPUT",
      name: "nm",
      label: "名称",
      required: true,
    },
    {
      type: "INPUT",
      name: "ver",
      label: "版本",
      required: true,
    },
    {
      type: "INPUT",
      name: "developer",
      label: "发布负责人",
      required: true,
    },
    {
      type: "DATEPICKER",
      name: "releTm",
      label: "发布时间",
      required: true,
    },
    {
      type: "TEXTAREA",
      name: "cont",
      label: "内容",
      width: "100%",
      componentProps: {
        rows: 12,
      },
      required: true,
    },
    {
      type: "TEXTAREA",
      name: "rmks",
      label: "备注",
      width: "100%",
      componentProps: {
        rows: 3,
      },
    },
  ];

  const onClose = () => {
    resetFormData();
    onCancel?.();
  };

  const handleOk = (data: Record<string, unknown>) => {
    if (id) {
      editFormData(id, data, () => {
        onClose();
        onOk?.();
      });
    } else {
      addFormData(data, () => {
        onClose();
        onOk?.();
      });
    }
  };

  return (
    <Form.Modal
      className={styles.LogChangeForm}
      title={title}
      open={open}
      onCancel={() => {
        onClose();
      }}
      onOk={handleOk}
      formItems={formItems}
      value={formData}
      layout="horizontal"
    />
  );
});

export default LogChangeForm;
