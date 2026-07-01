import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";

import { ChakraButtonProps, ColumnsType, FormItemProps, Panel, Operate } from "@hsu-react/ui";
import RouterService from "@/router/RouterService";

import RoleStore from "./RoleStore";
import RoleForm from "./RoleForm";
import MenuAssign from "./MenuAssign";
import styles from "./index.module.scss";

const Role: React.FC = observer(() => {
  const {
    setSearchData,
    initSearchData,
    dataSource,
    delData,
    isLoading,
    getDataSource,
    total,
    changePage,
    page,
    order,
    onOrderChange,
  } = RoleStore;
  const { getMenuList, getPermissions } = RouterService;
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("新增");
  const [id, setId] = useState<string>("");
  const [menuAssignOpen, setMenuAssignOpen] = useState<boolean>(false);
  const [menuAssignId, setMenuAssignId] = useState<string>("");
  const [menuAssignNm, setMenuAssignNm] = useState<string>("");

  useEffect(() => {
    initSearchData();
  }, [initSearchData]);

  const searchItems: FormItemProps[] = [
    {
      type: "INPUT",
      name: "cd__nm",
      label: "关键字",
      componentProps: { placeholder: "编码、名称" },
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
      hasPermi: ["sys:role:add"],
    },
    {
      title: "刷新权限缓存",
      icon: <ReloadOutlined />,
      onClick: () => {
        getMenuList(true);
        getPermissions(true);
      },
    },
  ];

  const columns: ColumnsType = [
    { title: "角色编码", dataIndex: "cd", width: 200 },
    { title: "角色名称", dataIndex: "nm", width: 200 },
    {
      title: "操作",
      width: 300,
      ellipsis: false,
      fixed: "right",
      align: "center",
      fixedWidth: true,
      render: (record) => {
        return (
          <Operate
            maxVisible={4}
            menu={[
              {
                title: "编辑",
                onClick: () => {
                  setTitle("修改");
                  setId(record.id);
                  setOpen(true);
                },
                hasPermi: ["sys:role:upd"],
              },
              {
                title: "角色权限",
                onClick: () => {
                  setMenuAssignId(record.id);
                  setMenuAssignNm(record.nm);
                  setMenuAssignOpen(true);
                },
                hasPermi: ["sys:role:upd"],
              },
              {
                title: "删除",
                delete: true,
                onConfirm: () => {
                  delData(record.id);
                },
                hasPermi: ["sys:role:del"],
                hidden: [1, 3].includes(record.type),
              },
            ]}
          />
        );
      },
    },
  ];

  return (
    <>
      <Panel.List
        className={styles.Role}
        searchProps={{
          searchItems,
          onSearch: setSearchData,
          onReset: initSearchData,
          beforeButtonGroup,
          hasPermi: ["sys:role:query"],
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
      <RoleForm
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
      <MenuAssign
        open={menuAssignOpen}
        id={menuAssignId}
        roleNm={menuAssignNm}
        onCancel={() => {
          setMenuAssignOpen(false);
          setMenuAssignId("");
          setMenuAssignNm("");
        }}
        onOk={() => {
          getDataSource();
        }}
      />
    </>
  );
});

export default Role;
