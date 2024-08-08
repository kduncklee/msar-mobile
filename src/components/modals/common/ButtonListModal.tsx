import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import LargeButton from '@components/inputs/LargeButton';
import ModalAnimation from '@/components/modals/common/ModalAnimation';

interface ButtonListModalProps {
  buttons: {
    title: string;
    value: any;
    backgroundColor: string;
    textColor: string;
  }[];
  title: string;
  modalVisible: boolean;
  onSelect: (value: any) => void;
  onCancel: () => void;
}

function ButtonListModal({
  buttons,
  title,
  modalVisible,
  onSelect,
  onCancel,
}: ButtonListModalProps) {
  return (
    <ModalAnimation modalVisible={modalVisible} tray onCancel={onCancel}>
      <>
        <View style={{ flex: 1 }} />
        <View style={styles.container}>
          <Text style={[elements.mediumText, { margin: 8, fontWeight: '500' }]}>
            {title}
          </Text>
          <FlatList
            style={{ borderRadius: 20 }}
            data={buttons}
            renderItem={({ item }) => (
              <LargeButton
                title={item.title}
                backgroundColor={item.backgroundColor}
                textColor={item.textColor}
                onPress={() => onSelect(item.value)}
              />
            )}
            ListFooterComponent={(
              <>
                <View style={{ height: 40 }} />
                <LargeButton
                  title="Cancel"
                  backgroundColor={colors.secondaryBg}
                  textColor={colors.grayText}
                  onPress={onCancel}
                />
              </>
            )}
          />
        </View>
      </>
    </ModalAnimation>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderColor: colors.grayText,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.primaryBg,
  },
});

export default ButtonListModal;
