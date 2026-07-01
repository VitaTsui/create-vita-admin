import React, { useEffect, useState } from "react";

import { Form, FormItemProps } from "@hsu-react/ui";
import {
  BASE_FUNCTION_TYPE,
  MENU_SHOW,
} from "@/stores/OptionsStore/StaticOptions";
import MenuFormStore from "./MenuFormStore";
import MenuStore from "../MenuStore";
import { Options } from "@/stores/OptionsStore";
import { observer } from "mobx-react-lite";
import styles from "./index.module.scss";

interface MenuFormProps {
  open?: boolean;
  title?: string;
  id?: string | number;
  onCancel?: () => void;
  onOk?: () => void;
  pid?: string | number;
}

const MenuForm: React.FC<MenuFormProps> = observer((props) => {
  const { open, title, id, onCancel, onOk, pid } = props;
  const { resetFormData, addFormData, editFormData, formData, getFormData } =
    MenuFormStore;
  const { menuTree } = MenuStore;
  const [formType, setFormType] = useState<number>(1);
  const [baseFunc, setBaseFunc] = useState<string[]>([]);

  useEffect(() => {
    if (id && open) {
      getFormData(id);
    }
  }, [getFormData, id, open]);

  useEffect(() => {
    if (typeof formData.type === "number") {
      setFormType(formData.type);
    } else {
      setFormType(1);
    }
  }, [formData]);

  // 类型派生：1 菜单，2 功能（与后端 sys_rsco.type 一致）
  const isMenu = formType === 1;
  const isFunction = formType === 2;

  const formItems: FormItemProps[] = [
    {
      type: "TREESELECT",
      name: "pid",
      label: "上级菜单",
      initialValue: pid,
      componentProps: {
        treeData: menuTree,
      },
    },
    { type: "INPUT", name: "nm", label: "菜单名称" },
    {
      type: "RADIO",
      name: "type",
      label: "类型",
      initialValue: 1,
      componentProps: {
        options: Options("MENU_TYPE"),
        onChange: (e) => {
          setFormType(Number(e.target.value));
        },
        optionType: "button",
        buttonStyle: "solid",
      },
    },
    {
      type: "ICONSELECT",
      name: "icon",
      label: "菜单图标",
      visible: isMenu,
    },
    {
      type: "INPUT",
      name: "path",
      label: "路由地址",
      required: true,
      visible: isMenu,
    },
    {
      type: "CHECKBOXGROUP",
      name: "baseFunc",
      label: "基础功能",
      componentProps: {
        options: BASE_FUNCTION_TYPE,
        outline: true,
        onChange: (value) => {
          setBaseFunc(value);
        },
      },
      visible: isFunction && !id,
    },
    {
      type: "INPUT",
      name: "perm",
      label: "权限标识",
      visible: isFunction,
      componentProps: {
        placeholder:
          baseFunc.length > 0
            ? "模块:功能，例如：sys:rsco"
            : "模块:功能:操作，例如：sys:rsco:add",
      },
    },
    {
      type: "INPUT",
      name: "url",
      label: "组件地址",
      visible: isMenu,
    },
    {
      type: "INPUTNUMBER",
      name: "seq",
      label: "显示排序",
      required: true,
      componentProps: {
        min: 0,
        max: 1000,
      },
    },
    {
      type: "RADIO",
      name: "status",
      label: "显示状态",
      initialValue: 0,
      componentProps: { options: MENU_SHOW },
      visible: isMenu,
    },
  ];

  const onClose = () => {
    resetFormData();
    setFormType(1);
    setBaseFunc([]);
    onCancel?.();
  };

  return (
    <Form.Modal
      className={styles.MenuForm}
      title={title}
      open={open}
      onCancel={() => {
        onClose();
      }}
      onOk={(data) => {
        if (id) {
          editFormData(id, data, () => {
            onClose();
            onOk?.();
          });
        } else {
          addFormData(data, () => {
            onClose();
            onOk?.();
          });
        }
      }}
      formItems={formItems}
      value={formData}
    />
  );
});

export default MenuForm;
