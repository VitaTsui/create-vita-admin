import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { PlusOutlined } from "@ant-design/icons";

import { ChakraButtonProps, ColumnsType, FormItemProps, Panel, Operate } from "@hsu-react/ui";
import OptionsStore, { Options } from "@/stores/OptionsStore";

import FileStore from "./FileStore";
import FileForm from "./FileForm";
import styles from "./index.module.less";

const File: React.FC = observer(() => {
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
  } = FileStore;
  const { getFileConfigStatus, getFileConfigType, getFileConfigActive } =
    OptionsStore;
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("新增");
  const [id, setId] = useState<string>("");

  useEffect(() => {
    initSearchData();
    getFileConfigStatus();
    getFileConfigType();
    getFileConfigActive();
  }, [
    getFileConfigActive,
    getFileConfigStatus,
    getFileConfigType,
    initSearchData,
  ]);

  const searchItems: FormItemProps[] = [
    { type: "INPUT", name: "nm", label: "名称" },
    {
      type: "SELECT",
      name: "active",
      label: "环境",
      componentProps: { options: Options("FILE_CONFIG_ACTIVE") },
    },
    {
      type: "SELECT",
      name: "type",
      label: "类型",
      componentProps: { options: Options("FILE_CONFIG_TYPE") },
    },
    {
      type: "SELECT",
      name: "status",
      label: "状态",
      componentProps: { options: Options("FILE_CONFIG_STATUS") },
    },
  ];

  const beforeButtonGroup: ChakraButtonProps[] = [
    {
      title: "新增",
      colorPalette: "blue",
      icon: <PlusOutlined />,
      onClick: () => {
        setTitle("新增");
        setId("");
        setOpen(true);
      },
      hasPermi: ["sys:fileConf:add"],
    },
  ];

  const columns: ColumnsType = [
    { title: "名称", dataIndex: "nm", width: 150 },
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
      title: "状态",
      dataIndex: "statusDsr",
      orderKey: "status",
      align: "center",
      width: 80,
      fixedWidth: true,
    },
    {
      title: "备注",
      dataIndex: "rmks",
      width: 250,
    },
    {
      title: "创建时间",
      dataIndex: "crtTm",
      align: "center",
      width: 160,
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
                setTitle("编辑");
                setId(record.id);
                setOpen(true);
              },
              hasPermi: ["sys:fileConf:upd"],
            },
            {
              title: "删除",
              delete: true,
              onConfirm: () => {
                delData(record.id);
              },
              hasPermi: ["sys:fileConf:del"],
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <Panel.List
        className={styles.File}
        searchProps={{
          searchItems,
          onSearch: setSearchData,
          onReset: initSearchData,
          beforeButtonGroup,
          hasPermi: ["sys:fileConf:query"],
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
      <FileForm
        open={open}
        title={title}
        id={id}
        onCancel={() => {
          setOpen(false);
          setId("");
        }}
        onOk={() => {
          getDataSource();
        }}
      />
    </>
  );
});

export default File;
