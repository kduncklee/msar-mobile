import type { DropdownSelectorCommonProps } from '@/components/inputs/DropdownSelector';
import DropdownSelector from '@/components/inputs/DropdownSelector';
import { useFieldContext } from '@/hooks/formContext';
import { labelValueItem } from '@/utility/reactForm';

function FormDropdownSelector({ options, ...dropdownProps }: DropdownSelectorCommonProps) {
  const field = useFieldContext<string>();
  const expandedOptions = [...options];
  const fieldValue = field.state?.value?.toString();
  // console.log('FormDropdownSelector', options, fieldValue);
  if (fieldValue && !expandedOptions.find(item => (item.value === fieldValue))) {
    expandedOptions.push(labelValueItem(fieldValue));
    console.log('FormDropdownSelector added');
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
