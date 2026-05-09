import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import { useTheme, useThemedStyles } from '../../theme';
import { GeneratedImage } from '../../types';
import { createStyles } from './styles';
import { formatDate } from './useGalleryActions';

interface FullscreenViewerProps {
  image: GeneratedImage | null;
  showDetails: boolean;
  onClose: () => void;
  onToggleDetails: () => void;
  onSave: (image: GeneratedImage) => void;
  onDelete: (image: GeneratedImage) => void;
}

export const FullscreenViewer: React.FC<FullscreenViewerProps> = ({
  image,
  showDetails,
  onClose,
  onToggleDetails,
  onSave,
  onDelete,
}) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { t } = useTranslation();

  return (
    <Modal
      visible={!!image}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.viewerContainer}>
        <TouchableOpacity
          style={styles.viewerBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        {image && (
          <View style={styles.viewerContent}>
            {!showDetails && (
              <Image
                source={{ uri: `file://${image.imagePath}` }}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            )}
            {showDetails && (
              <View style={styles.detailsSheet}>
                <View style={styles.detailsSheetHeader}>
                  <Text style={styles.detailsSheetTitle}>{t('gallery.imageDetails')}</Text>
                  <TouchableOpacity onPress={onToggleDetails}>
                    <Text style={styles.detailsSheetClose}>{t('common.done')}</Text>
                  </TouchableOpacity>
                </View>
                <Image
                  source={{ uri: `file://${image.imagePath}` }}
                  style={styles.detailsPreview}
                  resizeMode="contain"
                />
                <ScrollView style={styles.detailsContent}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('gallery.promptLabel')}</Text>
                    <Text style={styles.detailValue}>{image.prompt}</Text>
                  </View>
                  {image.negativePrompt ? (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>{t('gallery.negativeLabel')}</Text>
                      <Text style={styles.detailValue}>{image.negativePrompt}</Text>
                    </View>
                  ) : null}
                  <View style={styles.detailsMetaRow}>
                    <View style={styles.detailChip}>
                      <Text style={styles.detailChipText}>{t('gallery.steps', { count: image.steps })}</Text>
                    </View>
                    <View style={styles.detailChip}>
                      <Text style={styles.detailChipText}>{image.width}x{image.height}</Text>
                    </View>
                    <View style={styles.detailChip}>
                      <Text style={styles.detailChipText}>{t('gallery.seed', { seed: image.seed })}</Text>
                    </View>
                  </View>
                  <Text style={styles.detailDate}>{formatDate(image.createdAt)}</Text>
                </ScrollView>
              </View>
            )}
            <View style={styles.viewerActions}>
              <TouchableOpacity
                style={[styles.viewerButton, showDetails && styles.viewerButtonActive]}
                onPress={onToggleDetails}
              >
                <Icon name="info" size={22} color={showDetails ? colors.primary : colors.text} />
                <Text style={showDetails ? styles.viewerButtonTextPrimary : styles.viewerButtonText}>
                  {t('gallery.info')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewerButton} onPress={() => onSave(image)}>
                <Icon name="download" size={22} color={colors.text} />
                <Text style={styles.viewerButtonText}>{t('common.save')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewerButton} onPress={() => onDelete(image)}>
                <Icon name="trash-2" size={22} color={colors.error} />
                <Text style={styles.viewerButtonTextError}>{t('common.delete')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.viewerButton} onPress={onClose}>
                <Icon name="x" size={22} color={colors.text} />
                <Text style={styles.viewerButtonText}>{t('common.close')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};
