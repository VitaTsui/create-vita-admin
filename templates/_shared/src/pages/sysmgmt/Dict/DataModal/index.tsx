import React, { useEffect, useState } from "react";
import { ColumnsType, ChakraButtonProps, FormItemProps, Operate, Panel } from "@hsu-react/ui";

import DataModalStore from "./DataModalStore";
import DictForm from "../DictForm";
import { PlusOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import styles from "./index.module.scss";

export interface DataModalProps {
  id?: number | string;
}

const DataModal: React.FC<DataModalProps> = observer((props) => {
  const { id } = props;
  const {
    setId,
    initSearchData,
    dataSource,
    isLoading,
    delData,
    setSearchData,
    getDataSource,
    order,
    onOrderChange,
    total,
    changePage,
    page,
    resetStore,
  } = DataModalStore;
  const [dataOpen, setDataOpen] = useState<boolean>(false);
  const [dataTitle, setDataTitle] = useState<string>("");
  const [dataId, setDataId] = useState<number | string>("");

  useEffect(() => {
    if (id) {
      setId(id);
      initSearchData();
    }

    return () => {
      resetStore();
    };
  }, [id, initSearchData, setId, resetStore]);

  const searchItems: FormItemProps[] = [
    {
      type: "INPUT",
      name: "nm",
      label: "字典名称",
    },
  ];

  const beforeButtonGroup: ChakraButtonProps[] = [
    {
      title: "新增",
      colorPalette: "blue",
      icon: <PlusOutlined />,
      onClick: () => {
        setDataTitle("新增");
        setDataOpen(true);
      },
      hasPermi: ["sys:cat:add"],
    },
  ];

  const columns: ColumnsType = [
    { title: "字典编号", dataIndex: "cd", align: "center", width: 200 },
    { title: "字典名称", dataIndex: "nm", align: "center", width: 200 },
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
    { title: "备注", dataIndex: "rmks", align: "center", width: 200 },
    {
      title: "操作",
      width: 140,
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
                setDataTitle("修改");
                setDataId(record.id);
                setDataOpen(true);
              },
              hasPermi: ["sys:cat:upd"],
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
      <Panel.List
        wrapperClassName={styles.DataModal}
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
          staticDataSource: true,
          pagination: {
            total,
            onChange: (num, size) => changePage({ num, size }, false),
            current: page?.num,
            pageSize: page?.size,
          },
          order,
          onOrderChange,
        }}
      />
      <DictForm
        open={dataOpen}
        title={dataTitle}
        id={id}
        dataId={dataId}
        data={true}
        onCancel={() => {
          setDataOpen(false);
          setDataId("");
        }}
        onOk={() => {
          getDataSource();
        }}
      />
    </>
  );
});

export default DataModal;
