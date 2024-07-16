import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import type { tabItem } from '@/types/tabItem';

interface TabSelectorProps {
  tabs: tabItem[];
  selected?: number;
  onTabChange: (values: any) => void;
};

function TabSelector({ tabs, selected, onTabChange }: TabSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(selected || 0);

  const tabSelected = (index: number) => {
    setSelectedIndex(index);
    onTabChange(index);
  };

  return (
    <View style={styles.container}>
      {
        tabs.map((tab: tabItem, index: number) => {
          let textColor: string = colors.grayText;
          let divColor: string = colors.grayText;
          let badgeColor: string = colors.green;
          let badgeTextColor: string = colors.lightText;
          if (tab.badgeColor) {
            badgeColor = tab.badgeColor;
          }
          if (tab.badgeTextColor) {
            badgeTextColor = tab.badgeTextColor;
          }

          if (index === selectedIndex) {
            textColor = colors.yellow;
            divColor = colors.yellow;
          }

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.5}
              style={[styles.button, { borderBottomColor: divColor, borderBottomWidth: 2 }]}
              onPress={() => tabSelected(index)}
            >
              <Text style={[styles.buttonLabel, { color: textColor }]}>{tab.title}</Text>
              {!!tab.badge
              && (
                <View style={[elements.tabBadge, { backgroundColor: badgeColor }]}>
                  <Text style={[elements.tabBadgeText, { color: badgeTextColor }]} testID={`${tab.title}-badge`}>{tab.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 40,
    marginHorizontal: 0,
    marginTop: 10,
    overflow: 'hidden',

  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

});

export default TabSelector;
