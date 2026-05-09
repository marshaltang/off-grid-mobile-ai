import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { Button, Card } from '../components';
import { CustomAlert, showAlert, hideAlert, AlertState, initialAlertState } from '../components/CustomAlert';
import { useTheme, useThemedStyles } from '../theme';
import type { ThemeColors, ThemeShadows } from '../theme';
import { TYPOGRAPHY, SPACING } from '../constants';
import { authService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import logger from '../utils/logger';
import { useTranslation } from 'react-i18next';

interface PassphraseSetupScreenProps {
  isChanging?: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

export const PassphraseSetupScreen: React.FC<PassphraseSetupScreenProps> = ({
  isChanging = false,
  onComplete,
  onCancel,
}) => {
  const [currentPassphrase, setCurrentPassphrase] = useState('');
  const [newPassphrase, setNewPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertState, setAlertState] = useState<AlertState>(initialAlertState);
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();

  const { setEnabled } = useAuthStore();

  const validatePassphrase = (passphrase: string): string | null => {
    if (passphrase.length < 6) {
      return t('security.passphraseHint');
    }
    if (passphrase.length > 50) {
      return t('security.passphraseTooLong');
    }
    return null;
  };

  const handleSubmit = async () => {
    // Validate new passphrase
    const error = validatePassphrase(newPassphrase);
    if (error) {
      setAlertState(showAlert(t('security.invalidPassphraseTitle'), error));
      return;
    }

    // Check confirmation matches
    if (newPassphrase !== confirmPassphrase) {
      setAlertState(showAlert(t('security.mismatchTitle'), t('security.passphraseMismatch')));
      return;
    }

    setIsSubmitting(true);

    try {
      if (isChanging) {
        // Verify current passphrase and change
        const success = await authService.changePassphrase(currentPassphrase, newPassphrase);
        if (!success) {
          setAlertState(showAlert(t('common.error'), t('security.currentPassphraseIncorrect')));
          setIsSubmitting(false);
          return;
        }
        setAlertState(showAlert(t('common.success'), t('security.passphraseChanged')));
      } else {
        // Set new passphrase
        const success = await authService.setPassphrase(newPassphrase);
        if (!success) {
          setAlertState(showAlert(t('common.error'), t('security.failedToSetPassphrase')));
          setIsSubmitting(false);
          return;
        }
        setEnabled(true);
        setAlertState(showAlert(t('common.success'), t('security.passphraseLockEnabled')));
      }

      onComplete();
    } catch (err) {
      logger.warn('[PassphraseSetup] Operation failed:', err);
      setAlertState(showAlert(t('common.error'), t('security.errorOccurred')));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.cancelButton}>{t('common.cancel')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {isChanging ? t('security.changePassphrase') : t('security.setUpPassphrase')}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={styles.iconContainer}>
            <View style={styles.iconBox}>
              <Icon name="lock" size={48} color={colors.primary} />
            </View>
          </View>

          <Text style={styles.description}>
            {isChanging
              ? t('security.descriptionChange')
              : t('security.descriptionNew')}
          </Text>

          <Card style={styles.inputCard}>
            {isChanging && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('security.currentPassphrase')}</Text>
                <TextInput
                  style={styles.input}
                  value={currentPassphrase}
                  onChangeText={setCurrentPassphrase}
                  placeholder={t('security.enterCurrentPassphrase')}
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {isChanging ? t('security.newPassphrase') : t('security.passphrase')}
              </Text>
              <TextInput
                style={styles.input}
                value={newPassphrase}
                onChangeText={setNewPassphrase}
                placeholder={t('security.enterPassphraseMin6')}
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('security.confirmPassphrase')}</Text>
              <TextInput
                style={styles.input}
                value={confirmPassphrase}
                onChangeText={setConfirmPassphrase}
                placeholder={t('security.reEnterPassphrase')}
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </Card>

          <View style={styles.tips}>
            <Text style={styles.tipsTitle}>{t('security.tipsTitle')}</Text>
            <Text style={styles.tipItem}>{t('security.tipMix')}</Text>
            <Text style={styles.tipItem}>{t('security.tipMemorable')}</Text>
            <Text style={styles.tipItem}>{t('security.tipAvoidPersonal')}</Text>
          </View>

          <Button
            title={(() => {
              if (isSubmitting) return t('security.saving');
              return isChanging ? t('security.changePassphrase') : t('security.enableLock');
            })()}
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={styles.submitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <CustomAlert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        buttons={alertState.buttons}
        onClose={() => setAlertState(hideAlert())}
      />
    </SafeAreaView>
  );
};

const createStyles = (colors: ThemeColors, _shadows: ThemeShadows) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerSpacer: {
    width: 50,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancelButton: {
    ...TYPOGRAPHY.body,
    color: colors.textSecondary,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.lg,
  },
  iconContainer: {
    alignItems: 'center' as const,
    marginVertical: SPACING.xl,
  },
  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: colors.textSecondary,
    textAlign: 'center' as const,
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  inputCard: {
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: colors.text,
    marginBottom: SPACING.sm,
  },
  input: {
    ...TYPOGRAPHY.body,
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: SPACING.md,
    color: colors.text,
  },
  tips: {
    marginBottom: SPACING.xl,
  },
  tipsTitle: {
    ...TYPOGRAPHY.bodySmall,
    color: colors.textSecondary,
    marginBottom: SPACING.sm,
  },
  tipItem: {
    ...TYPOGRAPHY.bodySmall,
    color: colors.textMuted,
    lineHeight: 20,
  },
  submitButton: {
    marginBottom: 32,
  },
});
