import ChatStore from "@/stores/basisStoreClass/ChatStore";
import { computed, makeObservable, observable } from "mobx";
import { deepCopy } from "hsu-utils";
import { get, streamRequest } from "@/services/Axios";
import { generateRandomStr } from "hsu-utils";

const stopChat = (params: { taskId: string; apiKey: string }) =>
  get("/ai/dify/stopMessagesStream", { params });

export const NEW_CHAT_ID = "NEW_CHAT";

const dev = process.env.NODE_ENV === "development";
const apiBase = process.env.API_BASE;

class ChatModalStore extends ChatStore {
  // 流式请求接口地址（日志AI分析专用）
  protected accessor _streamApiUrl = `${
    dev ? apiBase : ""
  }/ai/dify/sendChatMessageStream/log`;

  // 继承的额外数据
  @computed
  get inheritedData() {
    return this._inheritedData;
  }
  @observable
  protected accessor _inheritedData = new Map<
    string,
    Record<string, unknown>
  >();

  constructor() {
    super();
    makeObservable(this);
  }

  /**
   * 重写 chat 方法，格式化请求体为接口文档要求的格式
   */
  public chat = ({
    apiKey,
    content,
    again,
    model,
  }: {
    apiKey: string;
    content: string;
    again?: boolean;
    model?: string;
  }) => {
    this._currentApiKey = apiKey;

    const files = deepCopy(this._fileList.get(this._currentChatId) || []);
    this._fileList.delete(this._currentChatId);

    let currentChatId = this._currentChatId;
    let thinkStart: Date | null = null;

    const config = this._getChatConfig(currentChatId, model);
    const messageId = generateRandomStr(16);

    // 获取当前对话
    let chat = [...(this._messages.get(currentChatId) || [])];

    // 如果是重新发送，移除最后一条消息
    if (again && chat.length > 1) {
      chat = chat.slice(0, chat.length - 1);
    }

    // 添加新消息（如果不是重新发送）
    if (!again) {
      chat.push(this._createNewMessage(content, files, messageId));
    }

    // 设置对话和状态
    this._messages.set(currentChatId, chat);
    this._assistanting.set(currentChatId, true);

    // 获取继承的额外数据
    const inheritedData = this._inheritedData.get(currentChatId) || {};

    // 格式化文件数据
    const formattedFiles = files.length
      ? files?.map((file) => ({
          type: "document",
          transferMethod: "local_file",
          uploadFileId: file.response?.id || "",
        }))
      : undefined;

    // 构建 sendRequest 对象
    const sendRequest = {
      apiKey,
      auto_generate_name: true,
      content,
      conversationId: currentChatId === NEW_CHAT_ID ? "" : currentChatId,
      files: formattedFiles,
      inputs: {
        ...config.agents.reduce((acc, item) => {
          acc[item.key as keyof typeof acc] = `${+item.open}`;
          return acc;
        }, {} as Record<string, string>),
        model: config.model,
      },
      userId: "",
    };

    // 构建符合接口文档的请求体
    const requestData: Record<string, unknown> = {
      sendRequest,
      ...inheritedData,
    };

    // 发起流请求
    const abortController = streamRequest(this._streamApiUrl, {
      data: requestData,
      onopen: async () => {
        thinkStart = new Date();
      },
      onmessage: (messages) => {
        try {
          const data = JSON.parse(messages.data);
          currentChatId = this._handleStreamMessage(
            data,
            currentChatId,
            chat,
            config,
            thinkStart,
            abortController
          );
        } catch {
          this._handleStreamEnd(currentChatId);
        }
      },
      onerror: () => {
        this._handleStreamEnd(currentChatId);
      },
      onclose: () => {
        this._handleStreamEnd(currentChatId);
      },
    });
  };

  /**
   * 清理指定 chatId 的所有数据（重写以包含 inheritedData）
   */
  protected _clearChatData = (chatId: string) => {
    this._messages.delete(chatId);
    this._assistanting.delete(chatId);
    this._fileList.delete(chatId);
    this._abortController.delete(chatId);
    this._taskId.delete(chatId);
    this._currentModel.delete(chatId);
    this._agentsState.delete(chatId);
    this._inheritedData.delete(chatId);
  };

  /**
   * 设置继承的额外数据
   */
  public setInheritedData = (data: Record<string, unknown>) => {
    this._inheritedData.set(this._currentChatId, data);
  };

  /**
   * 停止对话 API（实现基类抽象方法）
   */
  protected _stopChat = (params: { taskId: string; apiKey: string }) => {
    stopChat({
      taskId: params.taskId,
      apiKey: params.apiKey,
    });
  };
}

export default new ChatModalStore();
