import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { MenuType } from "..";
import { checkPathMatch } from "../_utils/pathMatch";

interface UseMenuPathOptions {
  allItems: MenuType[];
  collapsed: boolean;
  mode?: string;
}

/**
 * Hook that handles menu path matching and active state
 */
export const useMenuPath = ({
  allItems,
  collapsed,
  mode = "inline",
}: UseMenuPathOptions) => {
  const location = useLocation();
  const [menuKey, setMenuKey] = useState("");
  const [openKeys, setOpenkeys] = useState<string[]>([]);

  useEffect(() => {
    const _checkPath = (items: MenuType[], parents?: MenuType[]) => {
      const pathname = decodeURI(location.pathname);

      items?.forEach((item) => {
        if (item.children) {
          const _parents = parents ? [...parents, item] : [item];
          _checkPath(item.children, _parents);
        } else {
          const isMatch = checkPathMatch(pathname, item.key, item.parent?.path);

          if (isMatch) {
            // Handle param routes
            if (item.key.includes(":") && item.parent?.path) {
              setMenuKey(item.parent.path);
            } else {
              setMenuKey(item.key);
            }

            // Set the expanded menu items
            if (parents && !collapsed && mode !== "horizontal") {
              const _openKeys = parents?.map((item) => item.key);
              setOpenkeys([..._openKeys]);
            }
          }
        }
      });
    };

    setMenuKey("");
    setOpenkeys([]);
    _checkPath(allItems);
  }, [allItems, location, collapsed, mode]);

  return { menuKey, setMenuKey, openKeys, setOpenkeys };
};
