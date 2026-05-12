import React, { useState } from 'react';
import { View, Text, Switch, Platform, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { AdvancedToggle, Card } from '../../components';
import { Button } from '../../components/Button';
import { useTheme, useThemedStyles } from '../../theme';
import { useAppStore } from '../../stores';
import { useClearGpuCache } from '../../hooks/useImageGenerationSettings';
import { createStyles } from './styles';

// ─── Advanced Sub-Components ─────────────────────────────────────────────────

const EnhanceImageToggle: React.FC = () => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const { settings, updateSettings } = useAppStore();
  const trackColor = { false: colors.surfaceLight, true: `${colors.primary}80` };

  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleLabel}>{t('modelSettings.enhanceImagePrompts')}</Text>
        <Text style={styles.toggleDesc}>
          {settings?.enhanceImagePrompts
            ? t('modelSettings.enhanceOnDesc')
            : t('modelSettings.enhanceOffDesc')}
        </Text>
      </View>
      <Switch
        value={settings?.enhanceImagePrompts ?? false}
        onValueChange={(value) => updateSettings({ enhanceImagePrompts: value })}
        trackColor={trackColor}
        thumbColor={settings?.enhanceImagePrompts ? colors.primary : colors.textMuted}
      />
    </View>
  );
};

const ImageGpuSection: React.FC = () => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const { settings, updateSettings } = useAppStore();
  const { clearing, handleClearCache } = useClearGpuCache();
  const trackColor = { false: colors.surfaceLight, true: `${colors.primary}80` };
  const isOpenCL = settings?.imageUseOpenCL ?? true;

  return (
    <>
      <View style={styles.toggleRow}>
        <View style={styles.toggleInfo}>
          <Text style={styles.toggleLabel}>{t('modelSettings.openclGpuAccel')}</Text>
          <Text style={styles.toggleDesc}>
            {t('modelSettings.openclGpuAccelDesc')}
          </Text>
        </View>
        <Switch
          value={isOpenCL}
          onValueChange={(value) => updateSettings({ imageUseOpenCL: value })}
          trackColor={trackColor}
          thumbColor={isOpenCL ? colors.primary : colors.textMuted}
        />
      </View>
      {isOpenCL && (
        <TouchableOpacity
          style={[styles.toggleRow, styles.clearCacheRow]}
          onPress={handleClearCache}
          disabled={clearing}
        >
          <Text style={styles.clearCacheText}>
            {clearing ? t('modelSettings.clearing') : t('modelSettings.clearGpuCache')}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const DetectionMethodRow: React.FC = () => {
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const { settings, updateSettings } = useAppStore();

  if (settings?.imageGenerationMode !== 'auto') return null;

  return (
    <View style={styles.settingSection}>
      <Text style={styles.settingLabel}>{t('modelSettings.detectionMethod')}</Text>
      <Text style={styles.settingDesc}>
        {settings?.autoDetectMethod === 'pattern'
          ? t('modelSettings.detectionPatternDesc')
          : t('modelSettings.detectionLlmDesc')}
      </Text>
      <View style={styles.buttonRow}>
        <Button
          title={t('modelSettings.pattern')}
          variant="secondary"
          size="medium"
          active={settings?.autoDetectMethod === 'pattern'}
          onPress={() => updateSettings({ autoDetectMethod: 'pattern' })}
          style={styles.flex1}
        />
        <Button
          title={t('modelSettings.llm')}
          variant="secondary"
          size="medium"
          active={settings?.autoDetectMethod === 'llm'}
          onPress={() => updateSettings({ autoDetectMethod: 'llm' })}
          style={styles.flex1}
        />
      </View>
    </View>
  );
};

// ─── Advanced Section ────────────────────────────────────────────────────────

const ImageAdvancedSection: React.FC = () => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const { settings, updateSettings } = useAppStore();

  return (
    <>
      <View style={styles.sliderSection}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>{t('modelSettings.guidanceScale')}</Text>
          <Text style={styles.sliderValue}>{(settings?.imageGuidanceScale || 7.5).toFixed(1)}</Text>
        </View>
        <Text style={styles.sliderDesc}>{t('modelSettings.guidanceScaleDesc')}</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={20}
          step={0.5}
          value={settings?.imageGuidanceScale || 7.5}
          onSlidingComplete={(value) => updateSettings({ imageGuidanceScale: value })}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surface}
          thumbTintColor={colors.primary}
        />
      </View>

      <View style={styles.sliderSection}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>{t('modelSettings.imageThreads')}</Text>
          <Text style={styles.sliderValue}>{settings?.imageThreads ?? 4}</Text>
        </View>
        <Text style={styles.sliderDesc}>
          {t('modelSettings.imageThreadsDesc')}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={8}
          step={1}
          value={settings?.imageThreads ?? 4}
          onSlidingComplete={(value) => updateSettings({ imageThreads: value })}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surface}
          thumbTintColor={colors.primary}
        />
      </View>

      <DetectionMethodRow />
      <EnhanceImageToggle />

      {Platform.OS === 'android' && <ImageGpuSection />}
    </>
  );
};

// ─── Main Section ────────────────────────────────────────────────────────────

export const ImageGenerationSection: React.FC = () => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const { settings, updateSettings } = useAppStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const isAutoMode = settings?.imageGenerationMode === 'auto';
  const trackColor = { false: colors.surfaceLight, true: `${colors.primary}80` };

  return (
    <Card style={styles.section}>
      <Text style={styles.settingHelp}>
        {t('modelSettings.imageGenHelp')}
      </Text>

      {/* ── Basic Settings ── */}

      <View style={styles.toggleRow}>
        <View style={styles.toggleInfo}>
          <Text style={styles.toggleLabel}>{t('modelSettings.automaticDetection')}</Text>
          <Text style={styles.toggleDesc}>
            {isAutoMode
              ? t('modelSettings.autoDetectionDesc')
              : t('modelSettings.manualDetectionDesc')}
          </Text>
        </View>
        <Switch
          value={isAutoMode}
          onValueChange={(value) =>
            updateSettings({ imageGenerationMode: value ? 'auto' : 'manual' })
          }
          trackColor={trackColor}
          thumbColor={isAutoMode ? colors.primary : colors.textMuted}
        />
      </View>
      <Text style={styles.toggleNote}>
        {isAutoMode
          ? t('modelSettings.autoModeNote')
          : t('modelSettings.manualModeNote')}
      </Text>

      <View style={styles.sliderSection}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>{t('modelSettings.imageSteps')}</Text>
          <Text style={styles.sliderValue}>{settings?.imageSteps || 8}</Text>
        </View>
        <Text style={styles.sliderDesc}>{t('modelSettings.imageStepsDesc')}</Text>
        <Slider
          style={styles.slider}
          minimumValue={4}
          maximumValue={50}
          step={1}
          value={settings?.imageSteps || 8}
          onSlidingComplete={(value) => updateSettings({ imageSteps: value })}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surface}
          thumbTintColor={colors.primary}
        />
      </View>

      <View style={styles.sliderSection}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>{t('modelSettings.imageSize')}</Text>
          <Text style={styles.sliderValue}>{settings?.imageWidth ?? 256}x{settings?.imageHeight ?? 256}</Text>
        </View>
        <Text style={styles.sliderDesc}>{t('modelSettings.imageSizeDesc')}</Text>
        <Slider
          style={styles.slider}
          minimumValue={128}
          maximumValue={512}
          step={64}
          value={settings?.imageWidth ?? 256}
          onSlidingComplete={(value) => updateSettings({ imageWidth: value, imageHeight: value })}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surface}
          thumbTintColor={colors.primary}
        />
      </View>

      <AdvancedToggle isExpanded={showAdvanced} onPress={() => setShowAdvanced(!showAdvanced)} testID="image-advanced-toggle" />

      {showAdvanced && <ImageAdvancedSection />}
    </Card>
  );
};
