import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Chat, Modal, ModalProps, Table, ColumnsType } from "@hsu-react/ui";
import { observer } from "mobx-react-lite";
import ChatModalStore from "./ChatModalStore";
import { getUserInfo } from "@/utils/auth";
import { Options } from "@/stores/OptionsStore";
import { CaretDownOutlined, CaretRightOutlined } from "@ant-design/icons";
import { AnyObject } from "antd/es/_util/type";

const mutationObserver = new MutationObserver(() => {
  const target = document.querySelector(
    `.${styles.chatList}`,
  ) as HTMLDivElement;
  if (
    target &&
    target.scrollTop !== target.scrollHeight - target.clientHeight
  ) {
    target.scrollTop = target.scrollHeight - target.clientHeight;
  }
});

export interface ApiLogChatModalProps extends Omit<ModalProps, "children"> {
  apiKey: string;
  onCancel: () => void;
  /** 外部列表标题 */
  listTitle?: string;
  /** 与外部列表相同的列配置 */
  tableColumns?: ColumnsType<AnyObject>;
  /** 勾选行数据 */
  selectedRowsData?: AnyObject[];
  /** 与列表 rowKey 一致，默认 id */
  tableRowKey?: string;
}

const ChatModal: React.FC<ApiLogChatModalProps> = observer((props) => {
  const {
    apiKey,
    open,
    onCancel,
    listTitle,
    tableColumns,
    selectedRowsData,
    tableRowKey = "id",
    ...modalProps
  } = props;
  const {
    stop,
    assistanting,
    messages,
    chat,
    currentApiKey,
    currentChatId,
    setCurrentApiKey,
  } = ChatModalStore;
  const chatListRef = useRef<HTMLDivElement>(null);
  const chatListContentRef = useRef<HTMLDivElement>(null);
  const [contextExpanded, setContextExpanded] = useState(false);

  useEffect(() => {
    if (open) {
      setCurrentApiKey(apiKey);
      setContextExpanded(false);
    }
  }, [open, apiKey, setCurrentApiKey]);

  useEffect(() => {
    if (chatListRef.current && currentChatId) {
      const target = chatListRef.current;

      mutationObserver.observe(target, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      mutationObserver.disconnect();
    };
  }, [currentChatId]);

  const onReset = () => {
    if (assistanting.get(currentChatId)) {
      stop?.();
    }

    if (chatListRef.current) {
      const target = chatListRef.current;

      mutationObserver.disconnect();
      mutationObserver.observe(target, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  };

  const handleCancel = () => {
    if (assistanting.get(currentChatId)) {
      stop?.();
    }
    onCancel();
  };

  const selectedCount = selectedRowsData?.length ?? 0;
  const hasSelectedRows = selectedCount > 0;
  const trimmedListTitle =
    listTitle != null && String(listTitle).trim() !== ""
      ? String(listTitle).trim()
      : "";
  const hasContextHeader = trimmedListTitle !== "" || hasSelectedRows;
  const titleForTooltip = trimmedListTitle
    ? `${trimmedListTitle}${
        hasSelectedRows ? ` （已选 ${selectedCount} 条）` : ""
      }`
    : hasSelectedRows
      ? `已选数据（共 ${selectedCount} 条）`
      : "";

  return (
    <Modal
      {...modalProps}
      open={open}
      onCancel={handleCancel}
      title="日志AI分析"
      width={1200}
      footer={false}
      className={styles.ChatModal}
    >
      <div className={styles.chatBox}>
        {hasContextHeader ? (
          <div className={styles.contextHeader}>
            <div className={styles.contextTitleRow}>
              {hasSelectedRows ? (
                <button
                  type="button"
                  className={styles.contextToggle}
                  aria-expanded={contextExpanded}
                  aria-label={contextExpanded ? "收起已选数据" : "展开已选数据"}
                  onClick={() => setContextExpanded((v) => !v)}
                >
                  {contextExpanded ? (
                    <CaretDownOutlined />
                  ) : (
                    <CaretRightOutlined />
                  )}
                </button>
              ) : null}
              <div
                className={styles.contextListTitle}
                title={titleForTooltip || undefined}
              >
                {trimmedListTitle ? (
                  <>
                    {trimmedListTitle}
                    {hasSelectedRows ? (
                      <span className={styles.contextSelectedCount}>
                        （已选 {selectedCount} 条）
                      </span>
                    ) : null}
                  </>
                ) : hasSelectedRows ? (
                  `已选数据（共 ${selectedCount} 条）`
                ) : null}
              </div>
            </div>
            {contextExpanded && hasSelectedRows && selectedRowsData ? (
              <div className={styles.contextSelected}>
                <div className={styles.selectedRowsTableWrap}>
                  {tableColumns?.length ? (
                    <Table
                      className={styles.contextTable}
                      columns={tableColumns}
                      dataSource={selectedRowsData}
                      rowKey={tableRowKey}
                      pagination={false}
                      autoWidth={true}
                      scroll={true}
                      serialNumberColumn={true}
                      bordered={true}
                      fillPanel
                    />
                  ) : (
                    <div className={styles.contextTableEmpty}>
                      暂无可展示的列配置
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        <div
          className={styles.chatList}
          ref={chatListRef}
          onWheel={() => {
            if (chatListRef.current) {
              const target = chatListRef.current as HTMLDivElement;
              const scrollTop = target.scrollHeight - target.clientHeight;

              if (target.scrollTop === scrollTop) {
                mutationObserver.disconnect();
                mutationObserver.observe(target, {
                  childList: true,
                  subtree: true,
                  characterData: true,
                });
              } else {
                mutationObserver.disconnect();
              }
            }
          }}
        >
          <div className={styles.chatListContent} ref={chatListContentRef}>
            <Chat.List
              list={messages.get(currentChatId) || []}
              assistanting={assistanting.get(currentChatId)}
              userName={getUserInfo().nickname}
              assistantName={
                Options("LARGE_MODEL_API_KEY_LIST").find(
                  (item) => item.value === currentApiKey,
                )?.label
              }
            />
          </div>
        </div>
        <div className={styles.chatInput}>
          <Chat.Input
            onSend={(value) => {
              onReset();

              chat({
                apiKey: currentApiKey,
                content: value,
              });
            }}
            assistanting={assistanting.get(currentChatId)}
            onStop={() => {
              stop?.();
            }}
            uploadEnabled={false}
          />
        </div>
        <p>内容由 AI 大模型生成，请仔细甄别</p>
      </div>
    </Modal>
  );
});

export default ChatModal;
