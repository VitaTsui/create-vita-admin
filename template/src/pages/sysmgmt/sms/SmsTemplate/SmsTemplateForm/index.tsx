import React, { useEffect } from "react";

import { FormItemProps, Form } from "@hsu-react/ui";
import SmsTemplateFormStore from "./SmsTemplateFormStore";
import { observer } from "mobx-react-lite";
import styles from "./index.module.less";
import { Options } from "@/stores/OptionsStore";

interface SmsTemplateFormProps {
  open?: boolean;
  title?: string;
  id?: string | number;
  onCancel?: () => void;
  onOk?: () => void;
}

const SmsTemplateForm: React.FC<SmsTemplateFormProps> = observer((props) => {
  const { open, title, id, onCancel, onOk } = props;
  const { resetFormData, addFormData, editFormData, formData, getFormData } =
    SmsTemplateFormStore;

  useEffect(() => {
    if (id && open) {
      getFormData(id);
    }
  }, [getFormData, id, open]);

  const formItems: FormItemProps[] = [
    {
      type: "INPUT",
      name: "cd",
      label: "编码",
      required: true,
    },
    {
      type: "INPUT",
      name: "nm",
      label: "名称",
      required: true,
    },
    {
      type: "RADIO",
      name: "type",
      label: "类型",
      initialValue: Options("SMS_TEMPLATE_TYPE")?.[0]?.value,
      required: true,
      componentProps: { options: Options("SMS_TEMPLATE_TYPE") },
    },
    {
      type: "TEXTAREA",
      name: "cont",
      label: "内容",
      required: true,
      componentProps: {
        rows: 3,
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
      className={styles.SmsTemplateForm}
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

export default SmsTemplateForm;
