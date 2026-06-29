import React, { useEffect, useState } from "react";

import { ChakraButtonProps, ColumnsType, FormItemProps, Panel, Operate } from "@hsu-react/ui";
import SmsLogStore from "./SmsLogStore";
import { observer } from "mobx-react-lite";
import styles from "./index.module.less";
import SmsLogForm from "./SmsLogForm";
import OptionsStore, { Options } from "@/stores/OptionsStore";
import { SendOutlined, RedoOutlined } from "@ant-design/icons";
import SeedSmsForm from "./SeedSmsForm";
import SeedSmsFormStore from "./SeedSmsForm/SeedSmsFormStore";
import { PhoneRule } from "@hsu-react/ui/es/components/FormItem/rules";

const SmsLog: React.FC = observer(() => {
  const {
    setSearchData,
    initSearchData,
    dataSource,
    isLoading,
    total,
    changePage,
    page,
    delData,
    getDataSource,
    order,
    onOrderChange,
  } = SmsLogStore;
  const { getSmsConfigList, getSmsTemplateList, getSmsLogStatus } =
    OptionsStore;
  const { sendSms } = SeedSmsFormStore;
  const [id, setId] = useState<number | string>();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [sendSmsOpen, setSendSmsOpen] = useState(false);

  useEffect(() => {
    initSearchData();

    getSmsConfigList();
    getSmsTemplateList();
    getSmsLogStatus();
  }, [getSmsConfigList, getSmsTemplateList, getSmsLogStatus, initSearchData]);

  const searchItems: FormItemProps[] = [
    {
      type: "INPUT",
      name: "mob",
      label: "手机号",
      rules: [PhoneRule],
    },
    {
      type: "SELECT",
      name: "smsConfId",
      label: "短信配置",
      componentProps: {
        options: Options("SMS_CONFIG_LIST"),
      },
    },
    {
      type: "SELECT",
      name: "smsTemplateCd",
      label: "短信模板",
      componentProps: {
        options: Options("SMS_TEMPLATE_LIST"),
      },
    },
    {
      type: "SELECT",
      name: "status",
      label: "状态",
      componentProps: {
        options: Options("SMS_LOG_STATUS"),
      },
    },
    {
      type: "RANGEPICKER",
      name: "sendTm",
      label: "发送时间",
      componentProps: {
        placeholder: ["发送开始时间", "发送结束时间"],
      },
    },
    {
      type: "INPUT",
      name: "cont",
      label: "内容",
    },
  ];

  const beforeButtonGroup: ChakraButtonProps[] = [
    {
      title: "发送短信",
      colorPalette: "blue",
      icon: <SendOutlined />,
      onClick: () => {
        setSendSmsOpen(true);
      },
    },
  ];

  const columns: ColumnsType = [
    {
      title: "手机号",
      dataIndex: "mob",
      width: 120,
      align: "center",
      fixedWidth: true,
    },
    {
      title: "模板名称",
      dataIndex: "smsTemplateNm",
      width: 120,
      align: "center",
    },
    {
      title: "模板编码",
      dataIndex: "smsTemplateCd",
      width: 120,
      align: "center",
    },
    {
      title: "配置ID",
      dataIndex: "smsConfId",
      width: 180,
      align: "center",
      fixedWidth: true,
    },
    {
      title: "内容",
      dataIndex: "cont",
      width: 500,
    },
    {
      title: "状态",
      dataIndex: "statusDsr",
      orderKey: "status",
      width: 80,
      align: "center",
      fixedWidth: true,
    },
    {
      title: "发送时间",
      dataIndex: "sendTm",
      width: 160,
      align: "center",
      fixedWidth: true,
    },
    {
      title: "操作",
      width: 190,
      ellipsis: false,
      align: "center",
      fixed: "right",
      fixedWidth: true,
      render: (record) => (
        <>
          <Operate
            menu={[
              {
                title: "重发",
                icon: <RedoOutlined />,
                onClick: () => {
                  sendSms(
                    {
                      smsTemplateCode: record.smsTemplateCd,
                      mob: record.mob,
                      param: JSON.parse(record.param),
                    },
                    () => {
                      getDataSource();
                    }
                  );
                },
              },
              {
                title: "详情",
                onClick: () => {
                  setTitle("详情");
                  setOpen(true);
                  setId(record.id);
                },
                hasPermi: ["sys:smsLog:info"],
              },
              {
                title: "删除",
                delete: true,
                onConfirm: () => {
                  delData(record.id);
                },
                hasPermi: ["sys:smsLog:del"],
              },
            ]}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <Panel.List
        className={styles.SmsLog}
        searchProps={{
          searchItems,
          onSearch: setSearchData,
          onReset: initSearchData,
          beforeButtonGroup,
          hasPermi: ["sys:smsLog:query"],
        }}
        tableProps={{
          columns,
          dataSource,
          rowKey: "id",
          loading: isLoading,
          pagination: {
            total,
            onChange: (num, size) => changePage({ num, size }),
            current: page?.num,
            pageSize: page?.size,
          },
          order,
          onOrderChange,
        }}
      />
      <SmsLogForm
        open={open}
        title={title}
        id={id}
        onCancel={() => {
          setId("");
          setOpen(false);
        }}
      />
      <SeedSmsForm
        open={sendSmsOpen}
        title="发送短信"
        onCancel={() => {
          setSendSmsOpen(false);
        }}
        onOk={() => {
          getDataSource();
        }}
      />
    </>
  );
});

export default SmsLog;
