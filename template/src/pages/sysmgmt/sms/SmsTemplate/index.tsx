import React, { useEffect, useState } from "react";

import { ChakraButtonProps, ColumnsType, FormItemProps, Panel, Operate } from "@hsu-react/ui";
import SmsTemplateStore from "./SmsTemplateStore";
import { observer } from "mobx-react-lite";
import styles from "./index.module.less";
import SmsTemplateForm from "./SmsTemplateForm";
import { PlusOutlined } from "@ant-design/icons";
import OptionsStore, { Options } from "@/stores/OptionsStore";

const SmsTemplate: React.FC = observer(() => {
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
  } = SmsTemplateStore;
  const { getSmsTemplateType } = OptionsStore;
  const [id, setId] = useState<number | string>();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    initSearchData();

    getSmsTemplateType();
  }, [getSmsTemplateType, initSearchData]);

  const searchItems: FormItemProps[] = [
    {
      type: "INPUT",
      name: "cd__nm__cont",
      label: "关键字",
      componentProps: {
        placeholder: "编码、名称、内容",
      },
    },
    {
      type: "SELECT",
      name: "type",
      label: "类型",
      componentProps: { options: Options("SMS_TEMPLATE_TYPE") },
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
      hasPermi: ["sys:smsTemplate:add"],
    },
  ];

  const columns: ColumnsType = [
    {
      title: "ID",
      dataIndex: "id",
      align: "center",
      width: 180,
      fixedWidth: true,
    },
    {
      title: "编码",
      dataIndex: "cd",
      width: 120,
    },
    {
      title: "名称",
      dataIndex: "nm",
      width: 120,
    },
    {
      title: "类型",
      dataIndex: "typeDsr",
      orderKey: "type",
      align: "center",
      width: 100,
    },
    {
      title: "内容",
      dataIndex: "cont",
      width: 500,
    },
    {
      title: "排序",
      dataIndex: "seq",
      align: "center",
      width: 80,
      fixedWidth: true,
    },
    {
      title: "创建时间",
      dataIndex: "crtTm",
      width: 160,
      align: "center",
      fixedWidth: true,
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
              hasPermi: ["sys:smsTemplate:upd"],
            },
            {
              title: "删除",
              delete: true,
              onConfirm: () => {
                delData(record.id);
              },
              hasPermi: ["sys:smsTemplate:del"],
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <Panel.List
        className={styles.SmsTemplate}
        searchProps={{
          searchItems,
          onSearch: setSearchData,
          onReset: initSearchData,
          beforeButtonGroup,
          hasPermi: ["sys:smsTemplate:query"],
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
      <SmsTemplateForm
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

export default SmsTemplate;
