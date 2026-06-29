import React, { useEffect } from "react";

import { FormItemProps, Form } from "@hsu-react/ui";
import SmsLogFormStore from "./SmsLogFormStore";
import { observer } from "mobx-react-lite";
import styles from "./index.module.less";
import { PhoneRule } from "@hsu-react/ui/es/components/FormItem/rules";

interface SmsLogFormProps {
  open?: boolean;
  title?: string;
  id?: string | number;
  onCancel?: () => void;
  onOk?: () => void;
}

const SmsLogForm: React.FC<SmsLogFormProps> = observer((props) => {
  const { open, title, id, onCancel } = props;
  const { resetFormData, formData, getFormData } = SmsLogFormStore;

  useEffect(() => {
    if (id && open) {
      getFormData(id);
    }
  }, [getFormData, id, open]);

  const formItems: FormItemProps[] = [
    {
      type: "TEXT",
      name: "smsConfId",
      label: "短信配置ID",
    },
    {
      type: "TEXT",
      name: "smsConfNm",
      label: "短信配置名称",
    },
    {
      type: "TEXT",
      name: "smsTemplateId",
      label: "短信模板ID",
    },
    {
      type: "TEXT",
      name: "smsTemplateCd",
      label: "短信模板编码",
    },
    {
      type: "TEXT",
      name: "smsTemplateNm",
      label: "短信模板名称",
    },
    {
      type: "TEXT",
      name: "mob",
      label: "手机号码",
      rules: [PhoneRule],
    },
    {
      type: "TEXT",
      name: "param",
      label: "参数",
    },
    {
      type: "TEXT",
      name: "cont",
      label: "内容",
    },
    {
      type: "TEXT",
      name: "grpNo",
      label: "分组",
    },
    {
      type: "TEXT",
      name: "sendTm",
      label: "发送时间",
    },
    {
      type: "TEXT",
      name: "receTm",
      label: "接收时间",
    },
    {
      type: "TEXT",
      name: "outId",
      label: "业务ID",
    },
    {
      type: "TEXT",
      name: "reqId",
      label: "请求ID",
    },
    {
      type: "TEXT",
      name: "bizId",
      label: "发送回执ID",
    },
    {
      type: "TEXT",
      name: "sendNo",
      label: "状态码",
    },
    {
      type: "TEXT",
      name: "sendMsg",
      label: "状态码信息",
    },
    {
      type: "TEXT",
      name: "rmks",
      label: "备注",
    },
    {
      type: "TEXT",
      name: "statusDsr",
      label: "状态",
    },
  ];

  const onClose = () => {
    resetFormData();
    onCancel?.();
  };

  return (
    <Form.Modal
      className={styles.SmsLogForm}
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

export default SmsLogForm;
