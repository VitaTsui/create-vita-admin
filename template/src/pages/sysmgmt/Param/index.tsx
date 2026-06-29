import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { PlusOutlined } from "@ant-design/icons";

import { ChakraButtonProps, ColumnsType, FormItemProps, Panel, Operate } from "@hsu-react/ui";

import ParamStore from "./ParamStore";
import ParamForm from "./ParamForm";
import styles from "./index.module.less";

const Param: React.FC = observer(() => {
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
  } = ParamStore;
  const [id, setId] = useState<number | string>();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    initSearchData();
  }, [initSearchData]);

  const searchItems: FormItemProps[] = [
    {
      type: "INPUT",
      name: "cd",
      label: "键",
    },
    {
      type: "INPUT",
      name: "val",
      label: "值",
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
      hasPermi: ["sys:param:add"],
    },
  ];

  const columns: ColumnsType = [
    {
      title: "键",
      dataIndex: "cd",
      width: 200,
    },
    {
      title: "值",
      dataIndex: "val",
      width: 300,
    },
    {
      title: "排序",
      dataIndex: "seq",
      align: "center",
      width: 80,
      fixedWidth: true,
    },
    {
      title: "备注",
      dataIndex: "rmks",
      width: 240,
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
              hasPermi: ["sys:param:upd"],
            },
            {
              title: "删除",
              delete: true,
              onConfirm: () => {
                delData(record.id);
              },
              hasPermi: ["sys:param:del"],
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <Panel.List
        className={styles.Param}
        searchProps={{
          searchItems,
          onSearch: setSearchData,
          onReset: initSearchData,
          beforeButtonGroup,
          hasPermi: ["sys:param:query"],
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
      <ParamForm
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

export default Param;
