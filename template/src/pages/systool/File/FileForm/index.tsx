import React, { useEffect, useState } from "react";

import FileFormStore from "./FileFormStore";
import { Form, FormItemProps } from "@hsu-react/ui";
import { Options } from "@/stores/OptionsStore";
import { observer } from "mobx-react-lite";
import styles from "./index.module.less";

interface FileFormProps {
  open?: boolean;
  title?: string;
  id?: string | number;
  onCancel?: () => void;
  onOk?: () => void;
}

const FileForm: React.FC<FileFormProps> = observer((props) => {
  const { open, title, id, onCancel, onOk } = props;
  const { resetFormData, addFormData, editFormData, formData, getFormData } =
    FileFormStore;
  const [type, setType] = useState<number>(0);

  useEffect(() => {
    if (id && open) {
      getFormData(id);
    }
  }, [getFormData, id, open]);

  useEffect(() => {
    if (formData) {
      setType(formData?.type || 0);
    }
  }, [formData]);

  const formItems: FormItemProps[] = [
    { type: "INPUT", name: "nm", label: "名称", required: true },
    {
      type: "SELECT",
      name: "active",
      label: "环境",
      required: true,
      componentProps: { options: Options("FILE_CONFIG_ACTIVE") },
    },
    {
      type: "SELECT",
      name: "status",
      label: "状态",
      required: true,
      componentProps: { options: Options("FILE_CONFIG_STATUS") },
      initialValue: 0,
    },
    {
      type: "SELECT",
      name: "type",
      label: "类型",
      required: true,
      componentProps: {
        options: Options("FILE_CONFIG_TYPE"),
        onChange: (v) => {
          setType(v || 0);
        },
      },
    },
  ];

  const typeForm: Record<number, FormItemProps[]> = {
    0: [{ type: "TEXTAREA", name: "rmks", label: "备注" }],
    10: [
      { type: "INPUT", name: "domain", label: "自定义域名", required: true },
      { type: "TEXTAREA", name: "rmks", label: "备注" },
    ],
    20: [
      { type: "INPUT", name: "endpoint", label: "节点地址", required: true },
      { type: "INPUT", name: "bucket", label: "存储 bucket", required: true },
      { type: "INPUT", name: "accessKey", label: "accessKey", required: true },
      {
        type: "INPUT",
        name: "accessSecret",
        label: "accessSecret",
        required: true,
      },
      { type: "INPUT", name: "domain", label: "自定义域名" },
      { type: "TEXTAREA", name: "rmks", label: "备注" },
    ],
    30: [
      { type: "INPUT", name: "domain", label: "自定义域名", required: true },
      { type: "TEXTAREA", name: "rmks", label: "备注" },
    ],
    40: [
      { type: "INPUT", name: "domain", label: "自定义域名", required: true },
      { type: "TEXTAREA", name: "rmks", label: "备注" },
    ],
  };

  const onClose = () => {
    resetFormData();
    onCancel?.();
  };

  return (
    <Form.Modal
      className={styles.FileForm}
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
      formItems={formItems.concat(typeForm[type])}
      value={formData}
    />
  );
});

export default FileForm;
