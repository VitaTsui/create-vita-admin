import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { PlusOutlined, ReloadOutlined, SwapOutlined } from "@ant-design/icons";

import { ChakraButtonProps, ColumnsType, FormItemProps, Panel, Icon, Operate } from "@hsu-react/ui";
import OptionsStore, { Options } from "@/stores/OptionsStore";
import RouterService from "@/router/RouterService";

import MenuStore from "./MenuStore";
import MenuForm from "./MenuForm";
import styles from "./index.module.less";

const Menu: React.FC = observer(() => {
  const {
    setSearchData,
    initSearchData,
    dataSource,
    isLoading,
    delData,
    expandedIds,
    getDataSource,
    order,
    onOrderChange,
  } = MenuStore;
  const { getMenuList, getPermissions } = RouterService;
  const { getMenuCat, getMenuType } = OptionsStore;
  const [title, setTitle] = useState<string>("新增");
  const [id, setId] = useState<string>("");
  const [expanded, setExpanded] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [pid, setPid] = useState<string | number>("");

  useEffect(() => {
    initSearchData();

    getMenuCat();
    getMenuType();
  }, [getMenuCat, getMenuType, initSearchData]);

  const searchItems: FormItemProps[] = [
    {
      type: "SELECT",
      name: "cat",
      label: "分类",
      componentProps: { options: Options("MENU_CAT") },
    },
    { type: "INPUT", name: "nm", label: "菜单名称" },
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
      hasPermi: ["sys:rsco:add"],
    },
    {
      title: "展开/折叠",
      colorPalette: "red",
      icon: <SwapOutlined style={{ transform: "rotate(90deg)" }} />,
      onClick: () => {
        setExpanded(!expanded);
      },
    },
    {
      title: "刷新菜单缓存",
      icon: <ReloadOutlined />,
      onClick: () => {
        getMenuList(true);
        getPermissions(true);
      },
    },
  ];

  const columns: ColumnsType = [
    { title: "菜单名称", dataIndex: "nm", width: 300 },
    {
      title: "类型",
      dataIndex: "type",
      width: 80,
      align: "center",
      fixedWidth: true,
      render: (type) => {
        const isMenu = type === 1;
        return (
          <span
            className={styles.type}
            style={{
              backgroundColor: isMenu ? "#E6F2FF" : "#E9FAF3",
              border: isMenu ? "1px solid #3A8DFF" : "1px solid #2ECC71",
              color: isMenu ? "#3A8DFF" : "#2ECC71",
            }}
          >
            {Options("MENU_TYPE").find((item) => item.value === type)?.label}
          </span>
        );
      },
    },
    {
      title: "图标",
      dataIndex: "icon",
      align: "center",
      width: 80,
      fixedWidth: true,
      render: (icon) => {
        return <Icon icon={icon} />;
      },
    },
    {
      title: "排序",
      dataIndex: "seq",
      align: "center",
      width: 80,
      fixedWidth: true,
    },
    { title: "权限标识", dataIndex: "perm", width: 300 },
    {
      title: "组件路径",
      dataIndex: "url",
      width: 250,
    },
    { title: "路由地址", dataIndex: "path", width: 250 },
    {
      title: "显示状态",
      dataIndex: "status",
      width: 90,
      align: "center",
      render: (status) => {
        return typeof status === "number" ? (
          <span
            className={styles.status}
            style={{
              backgroundColor: status === 0 ? "#E8F5E9" : "#FFEBEE",
              border: status === 0 ? "1px solid #4CAF50" : "1px solid #EF4444",
              color: status === 0 ? "#2E7D32" : "#DC2626",
            }}
          >
            {status === 0 ? "显示" : "隐藏"}
          </span>
        ) : (
          ""
        );
      },
    },
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
              title: "新增",
              icon: <PlusOutlined />,
              onClick: () => {
                setTitle("新增");
                setOpen(true);
                setPid(record.id);
              },
              hasPermi: ["sys:rsco:add"],
            },
            {
              title: "编辑",
              onClick: () => {
                setTitle("修改");
                setOpen(true);
                setId(record.id);
              },
              hasPermi: ["sys:rsco:upd"],
            },
            {
              title: "删除",
              delete: true,
              onConfirm: () => {
                delData(record.id);
              },
              hasPermi: ["sys:rsco:del"],
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <Panel.List
        className={styles.Menu}
        searchProps={{
          searchItems,
          onSearch: setSearchData,
          onReset: initSearchData,
          beforeButtonGroup,
          hasPermi: ["sys:rsco:query"],
        }}
        tableProps={{
          columns,
          dataSource,
          rowKey: "id",
          loading: isLoading,
          pagination: false,
          scrollAutoHeight: false,
          expandable: {
            expandedRowKeys: expanded ? expandedIds : undefined,
          },
          serialNumberColumn: false,
          order,
          onOrderChange,
        }}
      />
      <MenuForm
        open={open}
        title={title}
        id={id}
        pid={pid}
        onCancel={() => {
          setOpen(false);
          setId("");
          setPid("");
        }}
        onOk={() => {
          getDataSource();
        }}
      />
    </>
  );
});

export default Menu;
