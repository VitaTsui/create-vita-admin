import React, { useEffect } from "react";

import DeptFormStore from "./DeptFormStore";
import DeptStore from "../DeptStore";
import { Form, FormItemProps } from "@hsu-react/ui";
import { observer } from "mobx-react-lite";
import styles from "./index.module.scss";

interface DeptFormProps {
  open?: boolean;
  title?: string;
  id?: string | number;
  onCancel?: () => void;
  onOk?: () => void;
}

const DeptForm: React.FC<DeptFormProps> = observer((props) => {
  const { open, title, id, onCancel, onOk } = props;
  const { resetFormData, addFormData, editFormData, formData, getFormData } =
    DeptFormStore;
  const { deptTree } = DeptStore;

  useEffect(() => {
    if (id && open) {
      getFormData(id);
    }
  }, [getFormData, id, open]);

  const formItems: FormItemProps[] = [
    {
      type: "TREESELECT",
      name: "pid",
      label: "上级组织",
      componentProps: { treeData: deptTree },
    },
    { type: "INPUT", name: "nm", label: "组织名称", required: true },
    { type: "INPUT", name: "cd", label: "组织编码" },
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
  ];

  const onClose = () => {
    resetFormData();
    onCancel?.();
  };

  return (
    <Form.Modal
      className={styles.DeptForm}
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

export default DeptForm;
