import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme, useThemedStyles } from '../../theme';
import { useAppStore } from '../../stores';
import { createStyles } from './styles';

export const SystemPromptSection: React.FC = () => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const { settings, updateSettings } = useAppStore();
  const systemPrompt = settings?.systemPrompt ?? 'You are a helpful AI assistant.';

  return (
    <View style={styles.systemPromptContainer}>
      <Text style={styles.settingHelp}>
        {t('modelSettings.systemPromptHelp')}
      </Text>
      <TextInput
        style={styles.textArea}
        value={systemPrompt}
        onChangeText={(text) => updateSettings({ systemPrompt: text })}
        multiline
        numberOfLines={4}
        placeholder={t('modelSettings.systemPromptPlaceholder')}
        placeholderTextColor={colors.textMuted}
      />
    </View>
  );
};
