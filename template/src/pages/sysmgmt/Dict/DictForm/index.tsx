import React, { useEffect } from "react";

import DictFormStore from "./DictFormStore";
import { Form, FormItemProps } from "@hsu-react/ui";
import { observer } from "mobx-react-lite";
import styles from "./index.module.less";

interface DictFormProps {
  open?: boolean;
  title?: string;
  id?: string | number;
  dataId?: string | number;
  onCancel?: () => void;
  onOk?: () => void;
  data?: boolean;
}

const DictForm: React.FC<DictFormProps> = observer((props) => {
  const { open, title, id, onCancel, onOk, data: isData, dataId } = props;
  const { resetFormData, addFormData, editFormData, formData, getFormData } =
    DictFormStore;

  useEffect(() => {
    if (open) {
      if (id && !isData) {
        getFormData(id);
      } else if (id && dataId && isData) {
        getFormData(dataId);
      }
    }
  }, [isData, dataId, getFormData, id, open]);

  const formItems: FormItemProps[] = [
    { type: "INPUT", name: "nm", label: "名称", required: true },
    { type: "INPUT", name: "cd", label: "编码", required: true },
    {
      type: "INPUTNUMBER",
      name: "seq",
      label: "显示排序",
      required: true,
      componentProps: {
        min: 0,
        max: 1000,
      },
    },
    {
      type: "INPUTNUMBER",
      name: "busSeq",
      label: "业务排序",
      required: true,
      componentProps: {
        min: 0,
        max: 1000,
      },
    },
    { type: "TEXTAREA", name: "rmks", label: "备注" },
  ];

  const onClose = () => {
    resetFormData();
    onCancel?.();
  };

  return (
    <Form.Modal
      className={styles.DictForm}
      title={title}
      open={open}
      onCancel={() => {
        onClose();
      }}
      onOk={(data) => {
        if (id && !isData) {
          editFormData(id, data, () => {
            onClose();
            onOk?.();
          });
        } else if (id && dataId && isData) {
          editFormData(dataId, { ...data, pid: id, tid: id }, () => {
            onClose();
            onOk?.();
          });
        } else {
          addFormData({ ...data, pid: id, tid: id }, () => {
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

export default DictForm;
