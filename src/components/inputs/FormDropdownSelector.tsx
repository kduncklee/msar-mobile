import type { DropdownSelectorCommonProps } from '@/components/inputs/DropdownSelector';
import DropdownSelector from '@/components/inputs/DropdownSelector';
import { useFieldContext } from '@/hooks/formContext';
import { labelValueItem } from '@/utility/reactForm';

function FormDropdownSelector({ options, ...dropdownProps }: DropdownSelectorCommonProps) {
  const field = useFieldContext<string>();
  const expandedOptions = [...options];
  if (field.state?.value && !expandedOptions.find(item => (item.value === field.state.value))) {
    expandedOptions.push(labelValueItem(field.state.value));
  }
  return (
    <DropdownSelector
      {...dropdownProps}
      options={expandedOptions}
      onSelect={(item) => {
        console.log('onSelect', item);
        field.handleChange(item.value);
      }}
      selectedValue={field.state.value}
    />
  );
}

export default FormDropdownSelector;
