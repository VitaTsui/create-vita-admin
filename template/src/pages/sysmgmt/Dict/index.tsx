import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { PlusOutlined } from "@ant-design/icons";

import { ChakraButtonProps, ColumnsType, FormItemProps, Panel, Operate } from "@hsu-react/ui";

import DictStore from "./DictStore";
import DictForm from "./DictForm";
import DataModal from "./DataModal";
import styles from "./index.module.less";

const Dict: React.FC = observer(() => {
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
  } = DictStore;
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("新增");
  const [id, setId] = useState<string>("");

  useEffect(() => {
    initSearchData();
  }, [initSearchData]);

  const searchItems: FormItemProps[] = [
    { type: "INPUT", name: "nm", label: "字典名称" },
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
      hasPermi: ["sys:cat:add"],
    },
  ];

  const columns: ColumnsType = [
    { title: "字典编号", dataIndex: "cd", width: 200 },
    { title: "字典名称", dataIndex: "nm", width: 200 },
    {
      title: "显示排序",
      dataIndex: "seq",
      align: "center",
      width: 100,
      fixedWidth: true,
    },
    {
      title: "业务排序",
      dataIndex: "busSeq",
      align: "center",
      width: 100,
      fixedWidth: true,
    },
    { title: "备注", dataIndex: "rmks", width: 200 },
    {
      title: "操作",
      width: 190,
      ellipsis: false,
      fixed: "right",
      align: "center",
      fixedWidth: true,
      render: (record) => (
        <Operate
          menu={[
            {
              title: "编辑",
              onClick: () => {
                setTitle("修改");
                setId(record.id);
                setOpen(true);
              },
              hasPermi: ["sys:cat:upd"],
            },
            {
              title: "数据",
              onClick: () => {
                setId(record.id);
              },
              hasPermi: ["sys:cat:list", "sys:cat:query", "sys:cat:page"],
            },
            {
              title: "删除",
              delete: true,
              onConfirm: () => {
                delData(record.id);
              },
              hasPermi: ["sys:cat:del"],
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <Panel.Default
        className={styles.Dict}
        contentClassName={styles.dictContent}
      >
        <Panel.List
          wrapperClassName={styles.dictList}
          searchProps={{
            searchItems,
            onSearch: setSearchData,
            onReset: initSearchData,
            beforeButtonGroup,
            hasPermi: ["sys:cat:query"],
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
        <DataModal id={id} />
      </Panel.Default>
      <DictForm
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

export default Dict;
