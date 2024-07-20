import * as DropdownMenu from 'zeego/dropdown-menu';

export interface MenuDropdownItem {
  name: string;
  onSelect?: () => unknown;
};
interface MenuDropdownProps {
  children: React.ReactElement;
  items: MenuDropdownItem[];
};

function MenuDropdown({ children, items }: MenuDropdownProps) {
  console.log(children);
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {children}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {items.map(item => (
          <DropdownMenu.Item
            key={item.name}
            onSelect={item.onSelect}
          >
            <DropdownMenu.ItemTitle>
              {item.name}
            </DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export default MenuDropdown;
