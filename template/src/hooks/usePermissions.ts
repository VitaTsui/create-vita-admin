import { createContext, useCallback, useContext, useMemo } from "react";

import { array_is_includes } from "hsu-utils";

export const PermissionsContent = createContext<{
  permissions: string[] | null;
}>({
  permissions: null,
});

export default function usePermissions(hasPermi?: string[]): {
  permissions: string[] | null;
  permitted: boolean;
  checkPermission: (permission: string[] | undefined) => boolean;
} {
  const permissions = useContext(PermissionsContent).permissions;

  const checkPermission = useCallback(
    (hasPermi: string[] | undefined) => {
      // If hasPermi or permissions is empty, treat as permitted
      if (!hasPermi || !permissions) {
        return true;
      }

      // If hasPermi or permissions is an empty array, treat as not permitted
      if (
        (Array.isArray(hasPermi) && !hasPermi.length) ||
        (Array.isArray(permissions) && !permissions.length)
      ) {
        return false;
      }

      // If neither hasPermi nor permissions is an empty array, check whether hasPermi is included in permissions
      return array_is_includes(permissions, hasPermi);
    },
    [permissions]
  );

  const permitted = useMemo(() => {
    return checkPermission(hasPermi);
  }, [hasPermi, checkPermission]);

  return {
    permissions,
    permitted,
    checkPermission,
  };
}
