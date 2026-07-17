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
  // Streaming request endpoint (dedicated to log AI analysis)
  protected accessor _streamApiUrl = `${
    dev ? apiBase : ""
  }/ai/dify/sendChatMessageStream/log`;

  // Inherited extra data
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
   * Override the chat method to format the request body as required by the API docs
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

    // Get the current conversation
    let chat = [...(this._messages.get(currentChatId) || [])];

    // If resending, remove the last message
    if (again && chat.length > 1) {
      chat = chat.slice(0, chat.length - 1);
    }

    // Append the new message (if not resending)
    if (!again) {
      chat.push(this._createNewMessage(content, files, messageId));
    }

    // Set the conversation and state
    this._messages.set(currentChatId, chat);
    this._assistanting.set(currentChatId, true);

    // Get the inherited extra data
    const inheritedData = this._inheritedData.get(currentChatId) || {};

    // Format the file data
    const formattedFiles = files.length
      ? files?.map((file) => ({
          type: "document",
          transferMethod: "local_file",
          uploadFileId: file.response?.id || "",
        }))
      : undefined;

    // Build the sendRequest object
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

    // Build the request body conforming to the API docs
    const requestData: Record<string, unknown> = {
      sendRequest,
      ...inheritedData,
    };

    // Initiate the streaming request
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
   * Clear all data of the given chatId (overridden to include inheritedData)
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
   * Set the inherited extra data
   */
  public setInheritedData = (data: Record<string, unknown>) => {
    this._inheritedData.set(this._currentChatId, data);
  };

  /**
   * Stop-conversation API (implements the base-class abstract method)
   */
  protected _stopChat = (params: { taskId: string; apiKey: string }) => {
    stopChat({
      taskId: params.taskId,
      apiKey: params.apiKey,
    });
  };
}

export default new ChatModalStore();
