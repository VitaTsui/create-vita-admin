import React, { useEffect } from "react";

import { Form, FormItemProps } from "@hsu-react/ui";
import RoleFormStore from "./RoleFormStore";
import { RolePermissionsData } from "@/services/apis/permit/Role/role";
import { observer } from "mobx-react-lite";
import styles from "./index.module.scss";

interface RoleFormProps {
  open?: boolean;
  title?: string;
  id?: string | number;
  onCancel?: () => void;
  onOk?: () => void;
}

const RoleForm: React.FC<RoleFormProps> = observer((props) => {
  const { open, title, id, onCancel, onOk } = props;
  const { resetFormData, addFormData, editFormData, formData, getFormData } =
    RoleFormStore;

  useEffect(() => {
    if (id && open) {
      getFormData(id);
    }
  }, [getFormData, id, open]);

  const formItems: FormItemProps[] = [
    {
      type: "INPUT",
      name: "cd",
      label: "角色编码",
      required: true,
    },
    {
      type: "INPUT",
      name: "nm",
      label: "角色名称",
      required: true,
    },
  ];

  const handleClose = () => {
    resetFormData();
    onCancel?.();
  };

  const handleOk = (data: RolePermissionsData) => {
    const callback = () => {
      handleClose();
      onOk?.();
    };

    if (id) {
      editFormData(id, data, callback);
    } else {
      addFormData(data, callback);
    }
  };

  return (
    <Form.Modal
      className={styles.RoleForm}
      title={title}
      open={open}
      onCancel={handleClose}
      onOk={handleOk}
      formItems={formItems}
      value={formData}
    />
  );
});

export default RoleForm;
