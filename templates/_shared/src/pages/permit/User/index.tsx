import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";

import { ChakraButtonProps, ColumnsType, FormItemProps, Panel, Operate, Tags } from "@hsu-react/ui";
import OptionsStore from "@/stores/OptionsStore";

import UserStore from "./UserStore";
import UserForm from "./UserForm";
import ResetPasswordForm from "./ResetPasswordForm";
import styles from "./index.module.scss";

const User: React.FC = observer(() => {
  const {
    setSearchData,
    initSearchData,
    dataSource,
    isLoading,
    delData,
    getDataSource,
    total,
    changePage,
    page,
    resetUserPwd,
    order,
    onOrderChange,
  } = UserStore;
  const { getRoleType } = OptionsStore;
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("新增");
  const [id, setId] = useState<string>("");
  const [type, setType] = useState<"add" | "edit" | "role">("add");
  const [resetPwd, setResetPwd] = useState<boolean>(false);

  useEffect(() => {
    initSearchData();
    getRoleType();
  }, [getRoleType, initSearchData]);

  const searchItems: FormItemProps[] = [
    {
      type: "INPUT",
      name: "username__phone__email__nickname__id",
      label: "关键字",
      componentProps: { placeholder: "ID、名称、账号、手机、邮箱" },
    },
    {
      type: "RANGEPICKER",
      name: "crtTm",
      label: "创建时间",
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
        setType("add");
        setOpen(true);
      },
      hasPermi: ["sys:user:add"],
    },
  ];

  const columns: ColumnsType = [
    {
      title: "用户ID",
      dataIndex: "id",
      align: "center",
      width: 180,
      fixedWidth: true,
    },
    { title: "登录账户", dataIndex: "username", width: 180 },
    { title: "用户名称", dataIndex: "nickname", width: 180 },
    {
      title: "角色",
      dataIndex: "roles",
      width: 220,
      align: "center",
      render: (roles) => (
        <Tags
          tags={roles?.map((role: { nm: string }) => role.nm)}
          align="center"
        />
      ),
    },
    { title: "移动电话", dataIndex: "phone", width: 100 },
    { title: "电子邮箱", dataIndex: "email", width: 150 },
    {
      title: "创建时间",
      dataIndex: "crtTm",
      align: "center",
      width: 160,
      fixedWidth: true,
    },
    {
      title: "操作",
      width: 190,
      ellipsis: false,
      fixed: "right",
      align: "center",
      fixedWidth: true,
      render: (record) => {
        return (
          <Operate
            maxVisible={2}
            menu={[
              {
                title: "编辑",
                onClick: () => {
                  setTitle("修改");
                  setId(record.id);
                  setType("edit");
                  setOpen(true);
                },
                hasPermi: ["sys:user:upd"],
              },
              {
                title: "分配角色",
                onClick: () => {
                  setTitle("用户角色权限");
                  setId(record.id);
                  setType("role");
                  setOpen(true);
                },
                hasPermi: ["sys:user:upd"],
              },
              {
                title: "重置密码",
                icon: <ReloadOutlined />,
                onClick: () => {
                  setId(record.id);
                  setResetPwd(true);
                },
                hasPermi: ["sys:user:updPwd"],
              },
              {
                title: "删除",
                delete: true,
                onConfirm: () => {
                  delData(record.id);
                },
                hasPermi: ["sys:user:del"],
                hidden: record.type === 0,
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
        className={styles.User}
        searchProps={{
          searchItems,
          onSearch: setSearchData,
          onReset: initSearchData,
          beforeButtonGroup,
          hasPermi: ["sys:user:query"],
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
      <UserForm
        open={open}
        title={title}
        id={id}
        type={type}
        onCancel={() => {
          setOpen(false);
          setId("");
          setType("add");
        }}
        onOk={() => {
          getDataSource();
        }}
      />
      <ResetPasswordForm
        open={resetPwd}
        id={id}
        onCancel={() => {
          setResetPwd(false);
          setId("");
        }}
        onOk={resetUserPwd}
      />
    </>
  );
});

export default User;
