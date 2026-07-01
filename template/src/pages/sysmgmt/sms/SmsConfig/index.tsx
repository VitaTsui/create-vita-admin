import React, { useEffect, useState } from "react";

import { ChakraButtonProps, ColumnsType, FormItemProps, Panel, Operate, Switch } from "@hsu-react/ui";
import SmsConfigStore from "./SmsConfigStore";
import { observer } from "mobx-react-lite";
import styles from "./index.module.scss";
import SmsConfigForm from "./SmsConfigForm";
import { PlusOutlined } from "@ant-design/icons";
import OptionsStore, { Options } from "@/stores/OptionsStore";
import SmsConfigFormStore from "./SmsConfigForm/SmsConfigFormStore";

const SmsConfig: React.FC = observer(() => {
  const {
    setSearchData,
    initSearchData,
    dataSource,
    isLoading,
    total,
    changePage,
    page,
    getDataSource,
    delData,
    order,
    onOrderChange,
  } = SmsConfigStore;
  const { editFormData } = SmsConfigFormStore;
  const { getSmsConfigActive, getSmsConfigType, getSmsConfigStatus } =
    OptionsStore;
  const [id, setId] = useState<number | string>();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    initSearchData();

    getSmsConfigActive();
    getSmsConfigType();
    getSmsConfigStatus();
  }, [
    getSmsConfigActive,
    getSmsConfigStatus,
    getSmsConfigType,
    initSearchData,
  ]);

  const searchItems: FormItemProps[] = [
    {
      type: "INPUT",
      name: "nm",
      label: "名称",
    },
    {
      type: "SELECT",
      name: "active",
      label: "环境",
      componentProps: { options: Options("SMS_CONFIG_ACTIVE") },
    },
    {
      type: "SELECT",
      name: "type",
      label: "类型",
      componentProps: { options: Options("SMS_CONFIG_TYPE") },
    },
    {
      type: "SELECT",
      name: "status",
      label: "状态",
      componentProps: { options: Options("SMS_CONFIG_STATUS") },
    },
  ];

  const beforeButtonGroup: ChakraButtonProps[] = [
    {
      title: "新增",
      colorPalette: "blue",
      icon: <PlusOutlined />,
      onClick: () => {
        setTitle("新增");
        setOpen(true);
      },
      hasPermi: ["sys:smsConf:add"],
    },
  ];

  const columns: ColumnsType = [
    {
      title: "ID",
      dataIndex: "id",
      width: 180,
      align: "center",
      fixedWidth: true,
    },
    {
      title: "名称",
      dataIndex: "nm",
      width: 150,
    },
    {
      title: "环境",
      dataIndex: "activeDsr",
      orderKey: "active",
      align: "center",
      width: 100,
    },
    {
      title: "类型",
      dataIndex: "typeDsr",
      orderKey: "type",
      align: "center",
      width: 100,
    },
    {
      title: "创建时间",
      dataIndex: "crtTm",
      width: 160,
      align: "center",
      fixedWidth: true,
    },
    {
      title: "是否启用",
      dataIndex: "",
      width: 100,
      align: "center",
      fixedWidth: true,
      render: (record) => (
        <Switch
          defaultChecked={!!record.status}
          options={Options("SMS_CONFIG_STATUS")}
          trueValue={1}
          falseValue={0}
          onChange={(checked) => {
            editFormData(
              record.id,
              {
                ...record,
                status: +checked,
              },
              () => {
                getDataSource();
              }
            );
          }}
          key={`${record.id}-${record.status}`}
        />
      ),
      hasPermi: ["sys:smsConf:upd"],
    },
    {
      title: "操作",
      width: 140,
      ellipsis: false,
      align: "center",
      fixed: "right",
      fixedWidth: true,
      render: (record) => (
        <Operate
          menu={[
            {
              title: "编辑",
              onClick: () => {
                setTitle("修改");
                setOpen(true);
                setId(record.id);
              },
              hasPermi: ["sys:smsConf:upd"],
            },
            {
              title: "删除",
              delete: true,
              onConfirm: () => {
                delData(record.id);
              },
              hasPermi: ["sys:smsConf:del"],
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <Panel.List
        className={styles.SmsConfig}
        searchProps={{
          searchItems,
          onSearch: setSearchData,
          onReset: initSearchData,
          beforeButtonGroup,
          hasPermi: ["sys:smsConf:query"],
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
      <SmsConfigForm
        open={open}
        title={title}
        id={id}
        onCancel={() => {
          setId("");
          setOpen(false);
        }}
        onOk={() => {
          getDataSource();
        }}
      />
    </>
  );
});

export default SmsConfig;
