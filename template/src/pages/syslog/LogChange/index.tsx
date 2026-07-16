import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import dayjs from "dayjs";
import { DownOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";

import { ChakraButtonProps, ColumnsType, FormItemProps, Panel, Operate } from "@hsu-react/ui";
import LogChangeStore from "./LogChangeStore";
import styles from "./index.module.scss";
import LogChangeForm from "./LogChangeForm";
import { LogChangeData } from "@/services/apis/syslog/logChange";

const LogChange: React.FC = observer(() => {
  const {
    setSearchData,
    initSearchData,
    dataSource,
    isLoading,
    total,
    changePage,
    page,
    order,
    onOrderChange,
    delData,
    getDataSource,
  } = LogChangeStore;
  const [id, setId] = useState<number | string>();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string>("新增");

  useEffect(() => {
    initSearchData();
  }, [initSearchData]);

  const searchItems: FormItemProps[] = [
    {
      type: "INPUT",
      name: "nm__developer",
      label: "关键字",
      componentProps: {
        placeholder: "名称、发布负责人",
      },
    },
    {
      type: "RANGEPICKER",
      name: "releTm",
      label: "发布时间",
      componentProps: {
        maxDate: dayjs(new Date()),
      },
    },
  ];

  const beforeButtonGroup: ChakraButtonProps[] = [
    {
      title: "新增",
      colorPalette: "blue",
      icon: <PlusOutlined />,
      onClick: () => {
        setTitle("新增");
        setId(undefined);
        setOpen(true);
      },
      hasPermi: ["sys:logChange:add"],
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
      title: "版本",
      dataIndex: "ver",
      width: 120,
      align: "center",
    },
    {
      title: "发布负责人",
      dataIndex: "developer",
      width: 120,
    },
    {
      title: "备注",
      dataIndex: "rmks",
      width: 200,
    },
    {
      title: "发布时间",
      dataIndex: "releTm",
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
                setTitle("编辑");
                setId(record.id);
                setOpen(true);
              },
              hasPermi: ["sys:logChange:upd"],
            },
            {
              title: "删除",
              delete: true,
              onConfirm: () => {
                delData(record.id);
              },
              hasPermi: ["sys:logChange:del"],
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <Panel.List
        className={styles.LogChange}
        searchProps={{
          searchItems,
          onSearch: setSearchData,
          onReset: initSearchData,
          beforeButtonGroup,
          hasPermi: ["sys:logChange:query"],
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
            simple: true,
          },
          order,
          onOrderChange,
          expandable: {
            expandIcon: ({ expanded, onExpand, record }) => (
              <span
                className={styles.expandRowIcon}
                onClick={(e) => {
                  onExpand(record, e);
                }}
              >
                {expanded ? <DownOutlined /> : <RightOutlined />}
              </span>
            ),
            expandedRowRender: (record: LogChangeData) => (
              <div className={styles.expandDetailCell}>
                {record.cont?.trim() ? record.cont : "—"}
              </div>
            ),
          },
        }}
      />
      <LogChangeForm
        open={open}
        title={title}
        id={id}
        onCancel={() => {
          setId(undefined);
          setOpen(false);
        }}
        onOk={() => {
          getDataSource();
        }}
      />
    </>
  );
});

export default LogChange;
