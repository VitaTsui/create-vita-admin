import React, { useEffect } from "react";

import { FormItemProps, Form } from "@hsu-react/ui";
import OprLogFormStore from "./OprLogFormStore";
import { observer } from "mobx-react-lite";
import styles from "./index.module.less";
import Cont from "../_components/Cont";

interface OprLogFormProps {
  open?: boolean;
  title?: string;
  id?: string | number;
  onCancel?: () => void;
  onOk?: () => void;
}

const OprLogForm: React.FC<OprLogFormProps> = observer((props) => {
  const { open, title, id, onCancel } = props;
  const { resetFormData, formData, getFormData } = OprLogFormStore;

  useEffect(() => {
    if (id && open) {
      getFormData(id);
    }
  }, [getFormData, id, open]);

  const formItems: FormItemProps[] = [
    {
      type: "TEXT",
      name: "userNm",
      label: "操作人名称",
    },
    {
      type: "TEXT",
      name: "crtTm",
      label: "创建时间",
    },
    {
      type: "TEXT",
      name: "busNm",
      label: "业务名称",
    },
    {
      type: "TEXT",
      name: "busTypeDsr",
      label: "业务类型",
    },
    {
      type: "AUTO",
      name: "cont",
      label: "操作内容",
      width: "100%",
      element: <Cont />,
    },
  ];

  const onClose = () => {
    resetFormData();
    onCancel?.();
  };

  return (
    <Form.Modal
      className={styles.OprLogForm}
      title={title}
      open={open}
      onCancel={() => {
        onClose();
      }}
      footer={false}
      formItems={formItems}
      value={formData}
      layout="horizontal"
    />
  );
});

export default OprLogForm;
