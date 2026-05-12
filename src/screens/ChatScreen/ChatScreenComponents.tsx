import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { AttachStep } from 'react-native-spotlight-tour';
import { ModelSelectorModal } from '../../components';
import { AnimatedEntry } from '../../components/AnimatedEntry';
import { llmService } from '../../services';
import { createStyles } from './styles';
import { useTheme } from '../../theme';

type StylesType = ReturnType<typeof createStyles>;
type ColorsType = ReturnType<typeof useTheme>['colors'];

export const NoModelScreen: React.FC<{
  styles: StylesType;
  colors: ColorsType;
  navigation: any;
  downloadedModelsCount: number;
  showModelSelector: boolean;
  setShowModelSelector: (v: boolean) => void;
  onSelectModel: (model: any) => void;
  onUnloadModel: () => void;
  isModelLoading: boolean;
}> = ({ styles, colors, navigation, downloadedModelsCount, showModelSelector, setShowModelSelector, onSelectModel, onUnloadModel, isModelLoading }) => {
  const { t } = useTranslation();
  return (
  <SafeAreaView style={styles.container} edges={['top']}>
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>{t('chats.newChat')}</Text>
        </View>
        <View style={styles.headerActions} />
      </View>
    </View>
    <View style={styles.noModelContainer}>
      <View style={styles.noModelIconContainer}>
        <Icon name="cpu" size={32} color={colors.textMuted} />
      </View>
      <Text style={styles.noModelTitle}>{t('chats.noModelSelected')}</Text>
      <Text style={styles.noModelText}>
        {downloadedModelsCount > 0
          ? t('chats.selectModelToStart')
          : t('chats.downloadModelToStart')}
      </Text>
      {downloadedModelsCount > 0 && (
        <TouchableOpacity style={styles.selectModelButton} onPress={() => setShowModelSelector(true)}>
          <Text style={styles.selectModelButtonText}>{t('chats.selectModel')}</Text>
        </TouchableOpacity>
      )}
    </View>
    <ModelSelectorModal
      visible={showModelSelector}
      onClose={() => setShowModelSelector(false)}
      onSelectModel={onSelectModel}
      onUnloadModel={onUnloadModel}
      isLoading={isModelLoading}
      currentModelPath={llmService.getLoadedModelPath()}
    />
  </SafeAreaView>
);
};

export const LoadingScreen: React.FC<{
  styles: StylesType;
  colors: ColorsType;
  navigation: any;
  loadingModelName: string;
  modelSize: string;
  hasVision: boolean;
}> = ({ styles, colors, navigation, loadingModelName, modelSize, hasVision }) => {
  const { t } = useTranslation();
  return (
  <SafeAreaView style={styles.container} edges={['top']}>
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>{t('chats.loadingModel')}</Text>
        </View>
        <View style={styles.headerActions} />
      </View>
    </View>
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>{t('chats.loadingModelName', { name: loadingModelName })}</Text>
      {modelSize ? <Text style={styles.loadingSubtext}>{modelSize}</Text> : null}
      <Text style={styles.loadingHint}>
        {t('chats.modelLoadingHint')}
      </Text>
      {hasVision && <Text style={styles.loadingHint}>{t('chats.visionEnabled')}</Text>}
    </View>
  </SafeAreaView>
);
};

export const ChatHeader: React.FC<{
  styles: StylesType;
  colors: ColorsType;
  activeConversation: any;
  activeModel: any;
  activeModelName?: string;
  activeImageModel: any;
  activeProject: any;
  navigation: any;
  setShowModelSelector: (v: boolean) => void;
  setShowSettingsPanel: (v: boolean) => void;
  setShowProjectSelector: (v: boolean) => void;
  isRemote?: boolean;
}> = ({ styles, colors, activeConversation, activeModel, activeModelName, activeImageModel, activeProject, navigation, setShowModelSelector, setShowSettingsPanel, setShowProjectSelector, isRemote }) => {
  const { t } = useTranslation();
  return (
  <View style={styles.header}>
    <View style={styles.headerRow}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color={colors.text} />
      </TouchableOpacity>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {activeConversation?.title || t('chats.newChat')}
        </Text>
        <View style={styles.headerSubtitleRow}>
          <TouchableOpacity style={styles.modelSelector} onPress={() => setShowModelSelector(true)} testID="model-selector">
            {isRemote && (
              <Icon name="cloud" size={12} color={colors.primary} style={styles.remoteIcon} />
            )}
            <Text style={styles.headerSubtitle} numberOfLines={1} testID="model-loaded-indicator">
              {activeModelName || activeModel?.name || t('remoteServers.status.unknown')}
            </Text>
            {activeImageModel && (
              <View style={styles.headerImageBadge}>
                <Icon name="image" size={10} color={colors.primary} />
              </View>
            )}
            <Text style={styles.modelSelectorArrow}>▼</Text>
          </TouchableOpacity>
          <Text style={styles.headerSubtitleDivider}>·</Text>
          <TouchableOpacity style={styles.headerProjectRow} onPress={() => setShowProjectSelector(true)}>
            <Icon name="folder" size={11} color={activeProject ? colors.primary : colors.textMuted} />
            <Text style={[styles.headerSubtitle, { color: activeProject ? colors.primary : colors.textMuted }]} numberOfLines={1}>
              {activeProject ? activeProject.name : t('chats.defaultProject')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.headerActions}>
        <AttachStep index={16}>
          <TouchableOpacity style={styles.iconButton} onPress={() => setShowSettingsPanel(true)} testID="chat-settings-icon">
            <Icon name="sliders" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </AttachStep>
      </View>
    </View>
  </View>
);
};

export const EmptyChat: React.FC<{
  styles: StylesType;
  colors: ColorsType;
  activeModel: any;
  activeModelName?: string;
  activeProject: any;
  setShowProjectSelector: (v: boolean) => void;
  isRemote?: boolean;
}> = ({ styles, colors, activeModel, activeModelName, activeProject, setShowProjectSelector, isRemote }) => {
  const { t } = useTranslation();
  return (
  <View style={styles.emptyChat}>
    <AnimatedEntry index={0} staggerMs={60}>
      <View style={styles.emptyChatIconContainer}>
        <Icon name="message-square" size={32} color={colors.textMuted} />
      </View>
    </AnimatedEntry>
    <AnimatedEntry index={1} staggerMs={60}>
      <Text style={styles.emptyChatTitle}>{t('chats.startConversation')}</Text>
    </AnimatedEntry>
    <AnimatedEntry index={2} staggerMs={60}>
      <Text style={styles.emptyChatText}>
        {t('chats.chatWithModel', { name: activeModelName || activeModel?.name || t('remoteServers.status.unknown') })}
      </Text>
    </AnimatedEntry>
    <AnimatedEntry index={3} staggerMs={60}>
      <TouchableOpacity style={styles.projectHint} onPress={() => setShowProjectSelector(true)}>
        <View style={styles.projectHintIcon}>
          <Text style={styles.projectHintIconText}>
            {activeProject?.name?.charAt(0).toUpperCase() || 'D'}
          </Text>
        </View>
        <Text style={styles.projectHintText}>
          {t('chats.projectHint', { name: activeProject?.name || t('chats.defaultProject') })}
        </Text>
      </TouchableOpacity>
    </AnimatedEntry>
    <AnimatedEntry index={4} staggerMs={60}>
      <Text style={styles.privacyText}>
        {isRemote
          ? t('chats.remotePrivacy')
          : t('chats.localPrivacy')}
      </Text>
    </AnimatedEntry>
  </View>
);
};

export const ImageProgressIndicator: React.FC<{
  styles: StylesType;
  colors: ColorsType;
  imagePreviewPath: string | null | undefined;
  imageGenerationStatus: string | null | undefined;
  imageGenerationProgress: { step: number; totalSteps: number } | null | undefined;
  onStop: () => void;
}> = ({ styles, colors, imagePreviewPath, imageGenerationStatus, imageGenerationProgress, onStop }) => {
  const { t } = useTranslation();
  return (
  <View style={styles.imageProgressContainer}>
    <View style={styles.imageProgressCard}>
      <View style={styles.imageProgressRow}>
        {imagePreviewPath && (
          <Image source={{ uri: imagePreviewPath }} style={styles.imagePreview} resizeMode="cover" />
        )}
        <View style={styles.imageProgressContent}>
          <View style={styles.imageProgressHeader}>
            <View style={styles.imageProgressIconContainer}>
              <Icon name="image" size={18} color={colors.primary} />
            </View>
            <View style={styles.imageProgressInfo}>
              <Text style={styles.imageProgressTitle}>
                {imagePreviewPath ? t('chats.refiningImage') : t('chats.generatingImage')}
              </Text>
              {imageGenerationStatus && (
                <Text style={styles.imageProgressStatus}>{imageGenerationStatus}</Text>
              )}
            </View>
            {imageGenerationProgress && (
              <Text style={styles.imageProgressSteps}>
                {imageGenerationProgress.step}/{imageGenerationProgress.totalSteps}
              </Text>
            )}
            <TouchableOpacity style={styles.imageStopButton} onPress={onStop}>
              <Icon name="x" size={16} color={colors.error} />
            </TouchableOpacity>
          </View>
          {imageGenerationProgress && (
            <View style={styles.imageProgressBarContainer}>
              <View style={styles.imageProgressBar}>
                <View
                  style={[
                    styles.imageProgressFill,
                    { width: `${(imageGenerationProgress.step / imageGenerationProgress.totalSteps) * 100}%` },
                  ]}
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  </View>
);
};

export const ImageViewerModal: React.FC<{
  styles: StylesType;
  colors: ColorsType;
  viewerImageUri: string | null;
  onClose: () => void;
  onSave: () => void;
}> = ({ styles, colors, viewerImageUri, onClose, onSave }) => {
  const { t } = useTranslation();
  return (
  <Modal visible={!!viewerImageUri} transparent animationType="fade" onRequestClose={onClose}>
    <View style={styles.imageViewerContainer}>
      <TouchableOpacity style={styles.imageViewerBackdrop} activeOpacity={1} onPress={onClose} />
      {viewerImageUri && (
        <View style={styles.imageViewerContent}>
          <Image source={{ uri: viewerImageUri }} style={styles.fullscreenImage} resizeMode="contain" />
          <View style={styles.imageViewerActions}>
            <TouchableOpacity style={styles.imageViewerButton} onPress={onSave}>
              <Icon name="download" size={24} color={colors.text} />
              <Text style={styles.imageViewerButtonText}>{t('common.save')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageViewerButton} onPress={onClose}>
              <Icon name="x" size={24} color={colors.text} />
              <Text style={styles.imageViewerButtonText}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  </Modal>
);
};
