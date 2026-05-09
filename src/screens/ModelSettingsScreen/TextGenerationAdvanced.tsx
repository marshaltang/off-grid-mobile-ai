import React, { useEffect, useState } from 'react';
import { View, Text, Switch, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/Button';
import { useTheme, useThemedStyles } from '../../theme';
import { useAppStore } from '../../stores';
import { CacheType, InferenceBackend, INFERENCE_BACKENDS } from '../../types';
import {
  useTextGenerationAdvanced,
  CACHE_TYPE_DESCRIPTIONS,
  GPU_LAYERS_MAX,
  CACHE_TYPE_OPTIONS,
} from '../../hooks/useTextGenerationAdvanced';
import { hardwareService } from '../../services/hardware';
import { createStyles } from './styles';

/** Feature flag: Set to true to enable HTP/Hexagon NPU in UI. Currently disabled. */
const HTP_UI_ENABLED = false;

// ─── Inference Backend ────────────────────────────────────────────────────────

type BackendOption = { id: InferenceBackend; label: string };

const BackendSelectorSection: React.FC = () => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const { settings, updateSettings } = useAppStore();
  const { gpuLayersEffective } = useTextGenerationAdvanced();
  const [hasNPU, setHasNPU] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      hardwareService.getSoCInfo().then(info => setHasNPU(info.hasNPU));
    }
  }, []);

  const IOS_BACKENDS: BackendOption[] = [
    { id: INFERENCE_BACKENDS.CPU, label: t('modelSettings.backendCpu') },
    { id: INFERENCE_BACKENDS.METAL, label: t('modelSettings.backendMetal') },
  ];

  const ANDROID_BASE_BACKENDS: BackendOption[] = [
    { id: INFERENCE_BACKENDS.CPU, label: t('modelSettings.backendCpu') },
    { id: INFERENCE_BACKENDS.OPENCL, label: t('modelSettings.backendOpencl') },
  ];

  const HTP_BACKEND: BackendOption = { id: INFERENCE_BACKENDS.HTP, label: t('modelSettings.backendHtp') };

  const backends: BackendOption[] = Platform.OS === 'ios'
    ? IOS_BACKENDS
    : hasNPU && HTP_UI_ENABLED ? [...ANDROID_BASE_BACKENDS, HTP_BACKEND] : ANDROID_BASE_BACKENDS;

  const defaultBackend = Platform.OS === 'ios' ? INFERENCE_BACKENDS.METAL : INFERENCE_BACKENDS.CPU;
  const current = settings.inferenceBackend ?? defaultBackend;
  const showLayers = current !== INFERENCE_BACKENDS.CPU;

  return (
    <>
      <View style={styles.toggleRow}>
        <View style={styles.toggleInfo}>
          <Text style={styles.toggleLabel}>{t('modelSettings.inferenceBackend')}</Text>
          <Text style={styles.toggleDesc}>
            {current === INFERENCE_BACKENDS.CPU && t('modelSettings.backendCpuDesc')}
            {current === INFERENCE_BACKENDS.OPENCL && t('modelSettings.backendOpenclDesc')}
            {current === INFERENCE_BACKENDS.HTP && t('modelSettings.backendHtpDesc')}
            {current === INFERENCE_BACKENDS.METAL && t('modelSettings.backendMetalDesc')}
          </Text>
        </View>
      </View>
      <View style={styles.strategyButtons}>
        {backends.map(b => (
          <Button
            key={b.id}
            title={b.label}
            variant="secondary"
            size="small"
            testID={`backend-${b.id}-button`}
            active={current === b.id}
            onPress={() => updateSettings({ inferenceBackend: b.id })}
            style={styles.flex1}
          />
        ))}
      </View>

      {showLayers && (
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>
              {current === INFERENCE_BACKENDS.HTP ? t('modelSettings.npuLayers') : t('modelSettings.gpuLayers')}
            </Text>
            <Text style={styles.sliderValue}>{gpuLayersEffective}</Text>
          </View>
          <Slider
            testID="gpu-layers-slider"
            style={styles.slider}
            minimumValue={1}
            maximumValue={GPU_LAYERS_MAX}
            step={1}
            value={gpuLayersEffective}
            onSlidingComplete={(value) => updateSettings({ gpuLayers: value })}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.surface}
            thumbTintColor={colors.primary}
          />
        </View>
      )}
    </>
  );
};

// ─── Flash Attention ──────────────────────────────────────────────────────────

const FlashAttentionSection: React.FC<{ trackColor: { false: string; true: string } }> = ({ trackColor }) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const { isFlashAttnOn, handleFlashAttnToggle } = useTextGenerationAdvanced();

  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleLabel}>{t('modelSettings.flashAttention')}</Text>
        <Text style={styles.toggleDesc}>
          {t('modelSettings.flashAttentionDesc')}
        </Text>
      </View>
      <Switch
        testID="flash-attn-switch"
        value={isFlashAttnOn}
        onValueChange={handleFlashAttnToggle}
        trackColor={trackColor}
        thumbColor={isFlashAttnOn ? colors.primary : colors.textMuted}
      />
    </View>
  );
};

// ─── KV Cache Section ─────────────────────────────────────────────────────────

const KvCacheSection: React.FC<{ cacheDisabled: boolean }> = ({ cacheDisabled }) => {
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const { displayCacheType, isFlashAttnOn, handleCacheTypeChange } = useTextGenerationAdvanced();

  return (
    <>
      <View style={styles.toggleRow}>
        <View style={styles.toggleInfo}>
          <Text style={styles.toggleLabel}>{t('modelSettings.kvCacheType')}</Text>
          <Text style={styles.toggleDesc}>
            {CACHE_TYPE_DESCRIPTIONS[displayCacheType]}
          </Text>
        </View>
      </View>
      <View style={styles.strategyButtons}>
        {CACHE_TYPE_OPTIONS.map((ct: CacheType) => (
          <Button
            key={ct}
            title={ct}
            variant="secondary"
            size="small"
            active={displayCacheType === ct}
            disabled={cacheDisabled && ct !== 'f16'}
            onPress={() => handleCacheTypeChange(ct)}
            style={styles.flex1}
          />
        ))}
      </View>
      {!isFlashAttnOn && (
        <Text style={styles.warningText}>
          {t('modelSettings.quantizedCacheWarning')}
        </Text>
      )}
    </>
  );
};

// ─── Model Loading Strategy ───────────────────────────────────────────────────

const ModelLoadingStrategySection: React.FC = () => {
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const { settings, updateSettings } = useAppStore();

  return (
    <>
      <View style={styles.toggleRow}>
        <View style={styles.toggleInfo}>
          <Text style={styles.toggleLabel}>{t('modelSettings.modelLoadingStrategy')}</Text>
          <Text style={styles.toggleDesc}>
            {settings?.modelLoadingStrategy === 'performance'
              ? t('modelSettings.strategyPerformance')
              : t('modelSettings.strategyMemory')}
          </Text>
        </View>
      </View>
      <View style={styles.strategyButtons}>
        <Button
          title={t('modelSettings.saveMemory')}
          variant="secondary"
          size="small"
          testID="strategy-memory-button"
          active={settings?.modelLoadingStrategy === 'memory'}
          onPress={() => updateSettings({ modelLoadingStrategy: 'memory' })}
          style={styles.flex1}
        />
        <Button
          title={t('modelSettings.fast')}
          variant="secondary"
          size="small"
          testID="strategy-performance-button"
          active={settings?.modelLoadingStrategy === 'performance'}
          onPress={() => updateSettings({ modelLoadingStrategy: 'performance' })}
          style={styles.flex1}
        />
      </View>
    </>
  );
};

// ─── Main Advanced Component ─────────────────────────────────────────────────

export const TextGenerationAdvanced: React.FC = () => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();
  const { settings, updateSettings } = useAppStore();
  const { cacheDisabled, cpuThreadsDisplayValue, cpuThreadsSliderValue } = useTextGenerationAdvanced();

  const trackColor = { false: colors.surfaceLight, true: `${colors.primary}80` };

  return (
    <>
      <View style={styles.sliderSection}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>{t('modelSettings.topP')}</Text>
          <Text style={styles.sliderValue}>{(settings?.topP || 0.9).toFixed(2)}</Text>
        </View>
        <Text style={styles.sliderDesc}>{t('modelSettings.topPDesc')}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0.1}
          maximumValue={1.0}
          step={0.05}
          value={settings?.topP || 0.9}
          onSlidingComplete={(value) => updateSettings({ topP: value })}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surface}
          thumbTintColor={colors.primary}
        />
      </View>

      <View style={styles.sliderSection}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>{t('modelSettings.repeatPenalty')}</Text>
          <Text style={styles.sliderValue}>{(settings?.repeatPenalty || 1.1).toFixed(2)}</Text>
        </View>
        <Text style={styles.sliderDesc}>{t('modelSettings.repeatPenaltyDesc')}</Text>
        <Slider
          style={styles.slider}
          minimumValue={1.0}
          maximumValue={2.0}
          step={0.05}
          value={settings?.repeatPenalty || 1.1}
          onSlidingComplete={(value) => updateSettings({ repeatPenalty: value })}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surface}
          thumbTintColor={colors.primary}
        />
      </View>

      <View style={styles.sliderSection}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>{t('modelSettings.cpuThreads')}</Text>
          <Text style={styles.sliderValue}>{cpuThreadsDisplayValue}</Text>
        </View>
        <Text style={styles.sliderDesc}>{t('modelSettings.cpuThreadsDesc')}</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={12}
          step={1}
          value={cpuThreadsSliderValue}
          onSlidingComplete={(value) => updateSettings({ nThreads: value })}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surface}
          thumbTintColor={colors.primary}
        />
      </View>

      <View style={styles.sliderSection}>
        <View style={styles.sliderHeader}>
          <Text style={styles.sliderLabel}>{t('modelSettings.batchSize')}</Text>
          <Text style={styles.sliderValue}>{settings?.nBatch || 256}</Text>
        </View>
        <Text style={styles.sliderDesc}>{t('modelSettings.batchSizeDesc')}</Text>
        <Slider
          style={styles.slider}
          minimumValue={32}
          maximumValue={512}
          step={32}
          value={settings?.nBatch || 256}
          onSlidingComplete={(value) => updateSettings({ nBatch: value })}
          minimumTrackTintColor={colors.primary}
          maximumTrackTintColor={colors.surface}
          thumbTintColor={colors.primary}
        />
      </View>

      <BackendSelectorSection />
      <FlashAttentionSection trackColor={trackColor} />
      <KvCacheSection cacheDisabled={cacheDisabled} />
      <ModelLoadingStrategySection />
    </>
  );
};
