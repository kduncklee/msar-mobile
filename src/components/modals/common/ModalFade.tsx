import { Modal, SafeAreaView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Header from '@/components/Header';

interface ModalFadeProps {
  children: React.ReactElement;
  header?: string;
  modalVisible: boolean;
  onCancel: () => void;
}

function ModalFade({ children, header, modalVisible, onCancel }: ModalFadeProps) {
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
        {header && (<Header title={header} zeroTopMargin backButton onBackPressed={onCancel} />)}
        {children}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
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
