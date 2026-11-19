import { MenuView } from '@react-native-menu/menu';

export interface MenuDropdownItem {
  name: string;
  onSelect?: () => unknown;
};
interface MenuDropdownProps {
  children: React.ReactElement;
  items: MenuDropdownItem[];
};

function MenuDropdown({ children, items }: MenuDropdownProps) {
  return (
    <MenuView
      actions={items.map(item => ({
        id: item.name,
        title: item.name,
      }))}
      onPressAction={({ nativeEvent }) => {
        const selected = items.find(item => item.name === nativeEvent.event);
        selected?.onSelect?.();
      }}
    >
      {children}
    </MenuView>
  );
}

export default MenuDropdown;
