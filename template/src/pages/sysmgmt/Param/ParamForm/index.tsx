import React, { useEffect } from "react";

import { FormItemProps, Form } from "@hsu-react/ui";
import ParamFormStore from "./ParamFormStore";
import { observer } from "mobx-react-lite";
import styles from "./index.module.less";

interface ParamFormProps {
  open?: boolean;
  title?: string;
  id?: string | number;
  onCancel?: () => void;
  onOk?: () => void;
}

const ParamForm: React.FC<ParamFormProps> = observer((props) => {
  const { open, title, id, onCancel, onOk } = props;
  const { resetFormData, addFormData, editFormData, formData, getFormData } =
    ParamFormStore;

  useEffect(() => {
    if (id && open) {
      getFormData(id);
    }
  }, [getFormData, id, open]);

  const formItems: FormItemProps[] = [
    {
      type: "INPUT",
      name: "cd",
      label: "键",
      required: true,
    },
    {
      type: "TEXTAREA",
      name: "val",
      label: "值",
      required: true,
      componentProps: {
        rows: 12,
      },
    },
    {
      type: "INPUTNUMBER",
      name: "seq",
      label: "排序",
      componentProps: {
        min: 0,
        max: 1000,
      },
    },
    {
      type: "TEXTAREA",
      name: "rmks",
      label: "备注",
      componentProps: {
        rows: 3,
      },
    },
  ];

  const onClose = () => {
    resetFormData();
    onCancel?.();
  };

  return (
    <Form.Modal
      className={styles.ParamForm}
      title={title}
      open={open}
      onCancel={() => {
        onClose();
      }}
      onOk={(data) => {
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
      }}
      formItems={formItems}
      value={formData}
    />
  );
});

export default ParamForm;
