import type { DropdownSelectorCommonProps } from '@/components/inputs/DropdownSelector';
import DropdownSelector from '@/components/inputs/DropdownSelector';
import { useFieldContext } from '@/hooks/formContext';

function FormDropdownSelector({ options, ...dropdownProps }: DropdownSelectorCommonProps) {
  const field = useFieldContext<string>();

  return (
    <DropdownSelector
      {...dropdownProps}
      options={options}
      onSelect={(item) => {
        console.log('onSelect', item);
        field.handleChange(item.value);
      }}
      selectedValue={field.state.value}
    />
  );
}

export default FormDropdownSelector;
