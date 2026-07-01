import React, { useEffect, useState } from "react";

import { FormItemProps, Form } from "@hsu-react/ui";
import SmsConfigFormStore from "./SmsConfigFormStore";
import { observer } from "mobx-react-lite";
import styles from "./index.module.scss";
import { Options } from "@/stores/OptionsStore";

const filedsNm: Record<string, string> = {
  endpoint: "节点地址",
  accessKey: "AccessKey",
  accessSecret: "AccessSecret",
  signName: "签名",
  clientId: "客户ID",
  clientSecret: "客户秘钥",
  grantType: "授权类型",
  tokenUrl: "授权地址",
  appCode: "应用编码",
  bizId: "业务编码",
  url: "接口地址",
  appName: "应用名称",
};

const FiledsObj: Record<number, string[]> = {
  9: ["config"],
  6: [
    "clientId",
    "clientSecret",
    "grantType",
    "tokenUrl",
    "appCode",
    "bizId",
    "url",
    "appName",
  ],
};

interface SmsConfigFormProps {
  open?: boolean;
  title?: string;
  id?: string | number;
  onCancel?: () => void;
  onOk?: () => void;
}

const SmsConfigForm: React.FC<SmsConfigFormProps> = observer((props) => {
  const { open, title, id, onCancel, onOk } = props;
  const { resetFormData, addFormData, editFormData, formData, getFormData } =
    SmsConfigFormStore;
  const [filedType, setFiledType] = useState<number>(0);

  useEffect(() => {
    if (id && open) {
      getFormData(id);
    }
  }, [getFormData, id, open]);

  useEffect(() => {
    if (open) {
      if (formData.type !== undefined) {
        setFiledType(formData.type);
      } else {
        setFiledType(Number(Options("SMS_CONFIG_TYPE")?.[0]?.value));
      }
    }
  }, [formData, open]);

  const formItems: FormItemProps[] = [
    {
      type: "INPUT",
      name: "nm",
      label: "名称",
      required: true,
    },
    {
      type: "RADIO",
      name: "active",
      label: "环境",
      initialValue: Options("SMS_CONFIG_ACTIVE")?.[0]?.value,
      required: true,
      componentProps: { options: Options("SMS_CONFIG_ACTIVE") },
    },
    {
      type: "RADIO",
      name: "type",
      label: "类型",
      initialValue: Options("SMS_CONFIG_TYPE")?.[0]?.value,
      required: true,
      componentProps: {
        options: Options("SMS_CONFIG_TYPE"),
        optionType: "button",
        buttonStyle: "solid",
        onChange: (e) => {
          setFiledType(Number(e.target.value));
        },
      },
      width: "100%",
    },
    ...(((
      FiledsObj[filedType] || [
        "endpoint",
        "accessKey",
        "accessSecret",
        "signName",
      ]
    )?.map((item) => ({
      type: "INPUT",
      name: item,
      label: filedsNm[item],
      required: true,
    })) || []) as FormItemProps[]),
    {
      type: "TEXTAREA",
      name: "rmks",
      label: "备注",
      componentProps: {
        rows: 3,
      },
      width: "100%",
    },
    {
      type: "RADIO",
      name: "status",
      label: "状态",
      initialValue: 1,
      required: true,
      componentProps: { options: Options("SMS_CONFIG_STATUS") },
    },
  ];

  const onClose = () => {
    resetFormData();
    onCancel?.();
  };

  return (
    <Form.Modal
      className={styles.SmsConfigForm}
      title={title}
      open={open}
      onCancel={() => {
        onClose();
      }}
      onOk={(data) => {
        const fileds = FiledsObj[filedType] || [
          "endpoint",
          "accessKey",
          "accessSecret",
          "signName",
        ];

        if (fileds && fileds.every((item) => data[item])) {
          data.config = JSON.stringify(
            fileds.reduce((acc, item) => {
              acc[item] = data[item];
              return acc;
            }, {} as Record<string, unknown>)
          );

          fileds?.forEach((item) => {
            delete data[item];
          });
        }

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
      layout="horizontal"
    />
  );
});

export default SmsConfigForm;
