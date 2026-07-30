import type { IDropdownRef } from '@carlos3g/element-dropdown';
import { Text, TouchableOpacity, View } from 'react-native';
import colors from '@/styles/colors';

export function emptyComponent(addItemText: string | undefined, ref: React.RefObject<IDropdownRef | null>, onSelect: (values: any) => void) {
  return (q: string) => addItemText
    ? (
        <TouchableOpacity
          activeOpacity={0.8}
          style={{ padding: 16 }}
          onPress={() => {
            ref?.current?.close();
            onSelect(q);
          }}
        >
          <Text style={{ color: colors.primaryText }}>
            {`${addItemText} "${q}"`}
          </Text>
        </TouchableOpacity>
      )
    : (
        <View style={{ padding: 16 }}>
          <Text style={{ color: colors.primaryText }}>
            {`Not found: "${q}"`}
          </Text>
        </View>
      );
}
