import React from "react";

import { FormItemProps, Form } from "@hsu-react/ui";
import SeedSmsFormStore from "./SeedSmsFormStore";
import { observer } from "mobx-react-lite";
import styles from "./index.module.scss";
import { Options } from "@/stores/OptionsStore";
import { PhoneRule } from "@hsu-react/ui/es/components/FormItem/rules";

interface SeedSmsFormProps {
  open?: boolean;
  title?: string;
  id?: string | number;
  onCancel?: () => void;
  onOk?: () => void;
}

const SeedSmsForm: React.FC<SeedSmsFormProps> = observer((props) => {
  const { open, title, onCancel, onOk } = props;
  const { sendSms, formData, resetFormData } = SeedSmsFormStore;
  const [form] = Form.useForm();

  const formItems: FormItemProps[] = [
    {
      type: "SELECT",
      name: "smsTemplateCode",
      label: "短信模板",
      required: true,
      componentProps: {
        options: Options("SMS_TEMPLATE_LIST"),
        onChange: (_, option) => {
          if (!Array.isArray(option)) {
            form.setFieldsValue({
              templateContent: option?.cont,
            });
          }
        },
      },
    },
    {
      type: "TEXTAREA",
      name: "templateContent",
      label: "模板内容",
      required: true,
      componentProps: {
        rows: 5,
      },
      disabled: true,
    },
    {
      type: "INPUT",
      name: "mob",
      label: "手机号码",
      required: true,
      rules: [PhoneRule],
    },
    {
      type: "CODEMIRROR",
      name: "param",
      label: "参数",
      required: true,
      componentProps: {
        language: "json",
        placeholder: "请输入 JSON 格式",
      },
    },
  ];

  const onClose = () => {
    resetFormData();
    onCancel?.();
  };

  return (
    <Form.Modal
      externalForm={form}
      className={styles.SeedSmsForm}
      title={title}
      open={open}
      onCancel={() => {
        onClose();
      }}
      onOk={(data) => {
        delete data.templateContent;

        if (typeof data.param === "string") {
          data.param = JSON.parse(data.param);
        }

        sendSms(data, () => {
          onClose();
          onOk?.();
        });
      }}
      formItems={formItems}
      value={formData}
    />
  );
});

export default SeedSmsForm;
