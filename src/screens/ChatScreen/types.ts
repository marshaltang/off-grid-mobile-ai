import { Message } from '../../types';

export type ChatMessageItem = {
  id: string;
  role: 'assistant';
  content: string;
  reasoningContent?: string;
  timestamp: number;
  isThinking?: boolean;
  isStreaming?: boolean;
};

export type StreamingState = {
  isThinking: boolean;
  streamingMessage: string;
  streamingReasoningContent: string;
  isStreamingForThisConversation: boolean;
};

export function getDisplayMessages(
  allMessages: Message[],
  streaming: StreamingState,
): (Message | ChatMessageItem)[] {
  const { isThinking, streamingMessage, streamingReasoningContent, isStreamingForThisConversation } = streaming;
  if (isThinking && isStreamingForThisConversation) {
    return [
      ...allMessages,
      { id: 'thinking', role: 'assistant' as const, content: '', timestamp: Date.now(), isThinking: true },
    ];
  }
  if ((streamingMessage || streamingReasoningContent) && isStreamingForThisConversation) {
    return [
      ...allMessages,
      { id: 'streaming', role: 'assistant' as const, content: streamingMessage, reasoningContent: streamingReasoningContent || undefined, timestamp: Date.now(), isStreaming: true },
    ];
  }
  return allMessages;
}

type PlaceholderTextOptions = {
  hasModel: boolean;
  isModelLoading: boolean;
  supportsVision: boolean;
  imageOnly?: boolean;
  t: (key: string) => string;
};

export function getPlaceholderText({
  hasModel,
  isModelLoading,
  supportsVision,
  imageOnly,
  t,
}: PlaceholderTextOptions): string {
  if (!hasModel) return isModelLoading ? t('chats.loadingModelPlaceholder') : t('chats.loadModelPlaceholder');
  if (imageOnly) return t('chats.describeImagePlaceholder');
  return supportsVision ? t('chats.typeMessageOrImagePlaceholder') : t('chats.typeMessagePlaceholder');
}
