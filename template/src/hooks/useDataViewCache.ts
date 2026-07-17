import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ColumnsType, FormItemProps } from "@hsu-react/ui";
import wsCache from "@/utils/wsCache";

interface ColumnCacheData {
  dataIndex: string;
  hidden: boolean;
  width?: number;
  ellipsis?: boolean;
  sort?: number;
}

interface CacheData {
  searchItemsVisible?: Array<{ name: string; visible: boolean }>;
  columnsConfig?: Array<ColumnCacheData>;
}

interface UseDataViewCacheOptions {
  /** Cache key prefix, defaults to 'dataViewSearch' */
  cacheKeyPrefix?: string;
  /** Initial search items */
  initialSearchItems: FormItemProps[];
  /** Initial column configuration */
  initialColumns: ColumnsType;
  /** Whether caching is enabled, defaults to true */
  enabled?: boolean;
}

interface UseDataViewCacheReturn {
  /** Search items (with cached state) */
  searchItems: FormItemProps[];
  /** Column configuration (with cached state) */
  columns: ColumnsType;
  /** Set the search items */
  setSearchItems: (items: FormItemProps[]) => void;
  /** Set the column configuration */
  setColumns: (columns: ColumnsType) => void;
  /** Handle search item filter changes */
  handleSearchFilterChange: (items: FormItemProps[]) => void;
  /** Handle column selection changes */
  handleColumnSelectionChange: (
    selectedDataIndexes: string[],
    dataSource: Array<{
      dataIndex: string;
      hidden: boolean;
      width?: number;
      ellipsis?: boolean;
      sort?: number;
    }>
  ) => void;
}

/**
 * Data view cache hook
 * Manages the cache of list display columns and search item selections
 */
export default function useDataViewCache(
  options: UseDataViewCacheOptions
): UseDataViewCacheReturn {
  const {
    cacheKeyPrefix = "dataViewSearch",
    initialSearchItems,
    initialColumns,
    enabled = true,
  } = options;

  const { pathname } = useLocation();
  const cacheKey = `${cacheKeyPrefix}_${pathname}`;

  const [searchItems, setSearchItemsState] = useState<FormItemProps[]>([]);
  const [columns, setColumnsState] = useState<ColumnsType>([]);
  const prevColumnsRef = useRef<string>("");

  // Restore state from cache
  useEffect(() => {
    if (!enabled) {
      setSearchItemsState(initialSearchItems);
      setColumnsState(initialColumns);
      return;
    }

    const cachedData: CacheData | null = wsCache.get(cacheKey);

    // Restore search items
    if (cachedData?.searchItemsVisible) {
      const restoredSearchItems = initialSearchItems?.map((item) => {
        const cachedItem = cachedData.searchItemsVisible?.find(
          (cached) => cached.name === item.name
        );
        return {
          ...item,
          visible: cachedItem ? cachedItem.visible : item.visible,
        };
      });
      setSearchItemsState(restoredSearchItems);
    } else {
      setSearchItemsState(initialSearchItems);
    }

    // Restore column configuration
    if (cachedData?.columnsConfig) {
      const restoredColumns = initialColumns?.map((col) => {
        const cachedCol = cachedData.columnsConfig?.find(
          (cached) => cached.dataIndex === col.dataIndex
        );
        if (cachedCol) {
          return {
            ...col,
            hidden: cachedCol.hidden,
            width: cachedCol.width !== undefined ? cachedCol.width : col.width,
            ellipsis:
              cachedCol.ellipsis !== undefined
                ? cachedCol.ellipsis
                : col.ellipsis,
            sort: cachedCol.sort !== undefined ? cachedCol.sort : col.sort,
          };
        }
        return col;
      });
      // Sort by sort
      restoredColumns.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
      setColumnsState(restoredColumns);
    } else {
      setColumnsState(initialColumns);
    }
  }, [cacheKey, enabled, initialSearchItems, initialColumns]);

  // Set search items (persisting to cache)
  const setSearchItems = useCallback(
    (items: FormItemProps[]) => {
      setSearchItemsState(items);
      if (enabled) {
        const searchItemsVisible = items?.map((item) => ({
          name: item.name,
          visible: item.visible !== false,
        }));
        const cachedData: CacheData = wsCache.get(cacheKey) || {};
        wsCache.set(cacheKey, {
          ...cachedData,
          searchItemsVisible,
        });
      }
    },
    [cacheKey, enabled]
  );

  // Set column configuration (persisting to cache)
  const setColumns = useCallback(
    (newColumns: ColumnsType) => {
      setColumnsState(newColumns);
      if (enabled && newColumns.length > 0) {
        const columnsConfig: ColumnCacheData[] = newColumns
          .filter((col) => col.dataIndex) // Filter out columns without a dataIndex
          ?.map((col) => ({
            dataIndex: col.dataIndex!,
            hidden: col.hidden || false,
            width: typeof col.width === "number" ? col.width : undefined,
            ellipsis:
              typeof col.ellipsis === "boolean" ? col.ellipsis : undefined,
            sort: typeof col.sort === "number" ? col.sort : undefined,
          }));
        const currentColumnsKey = JSON.stringify(columnsConfig);

        // Only update the cache when the configuration actually changed
        if (currentColumnsKey !== prevColumnsRef.current) {
          const cachedData: CacheData = wsCache.get(cacheKey) || {};
          wsCache.set(cacheKey, {
            ...cachedData,
            columnsConfig,
          });
          prevColumnsRef.current = currentColumnsKey;
        }
      }
    },
    [cacheKey, enabled]
  );

  // Handle search item filter changes
  const handleSearchFilterChange = useCallback(
    (items: FormItemProps[]) => {
      setSearchItems(items);
    },
    [setSearchItems]
  );

  // Handle column selection changes
  const handleColumnSelectionChange = useCallback(
    (
      _selectedDataIndexes: string[],
      dataSource: Array<{
        dataIndex: string;
        hidden: boolean;
        width?: number;
        ellipsis?: boolean;
        sort?: number;
      }>
    ) => {
      if (!enabled) return;

      const columnsConfig: ColumnCacheData[] = dataSource?.map((item) => ({
        dataIndex: item.dataIndex,
        hidden: item.hidden,
        width: item.width,
        ellipsis: item.ellipsis,
        sort: item.sort,
      }));
      const cachedData: CacheData = wsCache.get(cacheKey) || {};
      wsCache.set(cacheKey, {
        ...cachedData,
        columnsConfig,
      });

      // Sync the columns state and the cache reference
      setColumnsState((prevColumns) => {
        const updatedColumns = prevColumns?.map((col) => {
          const dataSourceItem = dataSource.find(
            (item) => item.dataIndex === col.dataIndex
          );
          if (dataSourceItem) {
            return {
              ...col,
              hidden: dataSourceItem.hidden,
              width:
                dataSourceItem.width !== undefined
                  ? dataSourceItem.width
                  : col.width,
              ellipsis:
                dataSourceItem.ellipsis !== undefined
                  ? dataSourceItem.ellipsis
                  : col.ellipsis,
              sort:
                dataSourceItem.sort !== undefined
                  ? dataSourceItem.sort
                  : col.sort,
            };
          }
          return col;
        });

        // Sort by sort
        updatedColumns.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

        // Update the cache reference
        const currentColumnsKey = JSON.stringify(columnsConfig);
        prevColumnsRef.current = currentColumnsKey;

        return updatedColumns;
      });
    },
    [cacheKey, enabled]
  );

  // Automatically save to cache whenever columns change
  useEffect(() => {
    if (enabled && columns.length > 0) {
      const columnsConfig: ColumnCacheData[] = columns
        .filter((col) => col.dataIndex) // Filter out columns without a dataIndex
        ?.map((col) => ({
          dataIndex: col.dataIndex!,
          hidden: col.hidden || false,
          width: typeof col.width === "number" ? col.width : undefined,
          ellipsis:
            typeof col.ellipsis === "boolean" ? col.ellipsis : undefined,
          sort: typeof col.sort === "number" ? col.sort : undefined,
        }));
      const currentColumnsKey = JSON.stringify(columnsConfig);

      // Only update the cache when the configuration actually changed
      if (currentColumnsKey !== prevColumnsRef.current) {
        const cachedData: CacheData = wsCache.get(cacheKey) || {};
        wsCache.set(cacheKey, {
          ...cachedData,
          columnsConfig,
        });
        prevColumnsRef.current = currentColumnsKey;
      }
    }
  }, [columns, cacheKey, enabled]);

  return {
    searchItems,
    columns,
    setSearchItems,
    setColumns,
    handleSearchFilterChange,
    handleColumnSelectionChange,
  };
}
