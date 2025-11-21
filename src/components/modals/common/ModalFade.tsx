import type { IconName } from '@/utility/icon';
import { Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';

interface ModalFadeProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerRightIcon?: IconName;
  onHeaderRight?: () => void;
  modalVisible: boolean;
  onCancel: () => void;
}

function ModalFade({ children, headerTitle, headerRightIcon, onHeaderRight, modalVisible, onCancel }: ModalFadeProps) {
  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <SafeAreaView style={styles.modalContent}>
        {/* Use top:0 because Android Modal already appears to adjust it. */}
        {headerTitle && (<Header title={headerTitle} backButton onBackPressed={onCancel} rightButtonIcon={headerRightIcon} onRightPressed={onHeaderRight} />)}
        {children}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
});

export default ModalFade;
