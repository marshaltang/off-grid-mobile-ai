import React from 'react';
import { View, Text, Modal, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';
import { useTheme, useThemedStyles } from '../../../theme';
import type { ThemeColors, ThemeShadows } from '../../../theme';
import { TYPOGRAPHY, SPACING } from '../../../constants';
import { LoadingState } from '../hooks/useHomeScreen';

const createStyles = (colors: ThemeColors, shadows: ThemeShadows) => ({
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: SPACING.xxl,
    alignItems: 'center' as const,
    marginHorizontal: 40,
    maxWidth: 300,
    ...shadows.large,
  },
  loadingTitle: {
    ...TYPOGRAPHY.h2,
    color: colors.text,
    marginTop: SPACING.xl,
  },
  loadingModelName: {
    ...TYPOGRAPHY.body,
    color: colors.primary,
    marginTop: SPACING.sm,
    textAlign: 'center' as const,
  },
  loadingHint: {
    ...TYPOGRAPHY.bodySmall,
    color: colors.textMuted,
    marginTop: SPACING.lg,
    textAlign: 'center' as const,
    lineHeight: 18,
  },
});

function getLoadingTitle(state: LoadingState): string {
  if (!state.modelName) return i18n.t('home.unloadingModel');
  if (state.modelName === 'Ejecting models...') return i18n.t('home.ejectingModels');
  return state.type === 'text' ? i18n.t('home.loadingTextModel') : i18n.t('home.loadingImageModel');
}

type Props = {
  loadingState: LoadingState;
};

export const LoadingOverlay: React.FC<Props> = ({ loadingState }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <Modal
      visible={loadingState.isLoading}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.loadingOverlay}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingTitle}>
            {getLoadingTitle(loadingState)}
          </Text>
          <Text style={styles.loadingModelName} numberOfLines={2}>
            {loadingState.modelName || t('home.pleaseWait')}
          </Text>
          <Text style={styles.loadingHint}>
            {t('home.loadingHint')}
          </Text>
        </View>
      </View>
    </Modal>
  );
};
