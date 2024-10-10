import { Modal, SafeAreaView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Header from '@/components/Header';
import type { IconName } from '@/utility/icon';

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
      animationType="fade"
      transparent
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <SafeAreaView style={styles.modalContent}>
        {/* Use top:0 because Android Modal already appears to adjust it. */}
        {headerTitle && (<Header title={headerTitle} zeroTopMargin backButton onBackPressed={onCancel} rightButtonIcon={headerRightIcon} onRightPressed={onHeaderRight} />)}
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
