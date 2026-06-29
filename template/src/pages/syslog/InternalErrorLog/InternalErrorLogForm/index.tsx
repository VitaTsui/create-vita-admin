import React, { useEffect } from "react";

import { FormItemProps, Form } from "@hsu-react/ui";
import InternalErrorLogFormStore from "./InternalErrorLogFormStore";
import { observer } from "mobx-react-lite";
import styles from "./index.module.less";

interface InternalErrorLogFormProps {
  open?: boolean;
  title?: string;
  id?: string | number;
  onCancel?: () => void;
  onOk?: () => void;
  mode?: "edit" | "detail"; // 新增模式：edit 编辑模式，detail 详情模式
}

const InternalErrorLogForm: React.FC<InternalErrorLogFormProps> = observer(
  (props) => {
    const { open, title, id, onCancel, onOk, mode = "edit" } = props;
    const { resetFormData, addFormData, editFormData, formData, getFormData } =
      InternalErrorLogFormStore;

    useEffect(() => {
      if (id && open) {
        getFormData(id);
      }
    }, [getFormData, id, open]);

    // 详情模式的表单字段
    const detailFormItems: FormItemProps[] = [
      {
        type: "TEXT",
        name: "id",
        label: "ID",
      },
      {
        type: "TEXT",
        name: "method",
        label: "方法",
      },
      {
        type: "TEXT",
        name: "rcdTm",
        label: "记录时间",
      },
      {
        type: "TEXT",
        name: "regArg",
        label: "请求参数",
        width: "100%",
      },
      {
        type: "TEXT",
        name: "errInfo",
        label: "失败信息",
        width: "100%",
      },
    ];

    // 编辑模式的表单字段（保持原有逻辑，可根据实际需求添加）
    const editFormItems: FormItemProps[] = [];

    const formItems: FormItemProps[] =
      mode === "detail" ? detailFormItems : editFormItems;

    const onClose = () => {
      resetFormData();
      onCancel?.();
    };

    const handleOk = (data: Record<string, unknown>) => {
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
    };

    return (
      <Form.Modal
        className={styles.InternalErrorLogForm}
        title={mode === "detail" ? "日志详情" : title}
        open={open}
        onCancel={onClose}
        onOk={mode === "detail" ? undefined : handleOk}
        formItems={formItems}
        value={formData}
        footer={mode === "detail" ? false : undefined}
        layout={mode === "detail" ? "horizontal" : undefined}
      />
    );
  }
);

export default InternalErrorLogForm;
