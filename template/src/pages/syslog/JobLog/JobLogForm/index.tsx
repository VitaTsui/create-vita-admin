import React, { useEffect } from "react";

import { FormItemProps, Form } from "@hsu-react/ui";
import JobLogFormStore from "./JobLogFormStore";
import { observer } from "mobx-react-lite";
import styles from "./index.module.scss";

interface JobLogFormProps {
  open?: boolean;
  id?: string | number;
  onCancel?: () => void;
  date?: [string, string];
}

const JobLogForm: React.FC<JobLogFormProps> = observer((props) => {
  const { open, id, onCancel, date } = props;
  const { resetFormData, formData, getFormData } = JobLogFormStore;

  useEffect(() => {
    if (id && date && open) {
      getFormData(id, { crtTm: date });
    }
  }, [date, getFormData, id, open]);

  const formItems: FormItemProps[] = [
    {
      type: "TEXT",
      name: "cd",
      label: "任务编码",
    },
    {
      type: "TEXT",
      name: "nm",
      label: "任务名称",
    },
    {
      type: "TEXT",
      name: "jobTrackerAddr",
      label: "执行机器地址",
    },
    {
      type: "TEXT",
      name: "currentRetryTimes",
      label: "现在重试次数",
    },
    {
      type: "TEXT",
      name: "maxRetryTimes",
      label: "最大重试次数",
    },
    {
      type: "TEXT",
      name: "spendTime",
      label: "运行时长(ms)",
    },
    {
      type: "TEXT",
      name: "statusDsr",
      label: "状态",
    },
    {
      type: "TEXT",
      name: "begTm",
      label: "开始时间",
    },
    {
      type: "TEXT",
      name: "endTm",
      label: "结束时间",
    },
    {
      type: "TEXT",
      name: "jobParams",
      label: "任务参数",
      width: "100%",
    },
    {
      type: "TEXT",
      name: "result",
      label: "结果",
      width: "100%",
    },
  ];

  const onClose = () => {
    resetFormData();
    onCancel?.();
  };

  return (
    <Form.Modal
      className={styles.JobLogForm}
      title="日志详情"
      open={open}
      onCancel={() => {
        onClose();
      }}
      formItems={formItems}
      value={formData}
      footer={false}
      layout="horizontal"
    />
  );
});

export default JobLogForm;
