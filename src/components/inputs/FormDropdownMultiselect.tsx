import type { DropdownMultiselectCommonProps } from '@/components/inputs/DropdownMultiselect';
import type { LabelValue } from '@/utility/reactForm';
import DropdownMultiselect from '@/components/inputs/DropdownMultiselect';
import { useFieldContext } from '@/hooks/formContext';
import { labelValueItem } from '@/utility/reactForm';

function FormDropdownSelector<
  TOption extends LabelValue,
>({ options, ...dropdownProps }: DropdownMultiselectCommonProps<TOption>) {
  const field = useFieldContext<string[]>();

  const expandedOptions: LabelValue[] = [...options];
  if (field.state?.value) {
    field.state.value.forEach((name: string) => {
      const fieldValue = name?.toString();
      if (!expandedOptions.find(item => (item.value === fieldValue))) {
        expandedOptions.push(labelValueItem(fieldValue));
      }
    });
  }

  return (
    <DropdownMultiselect
      {...dropdownProps}
      options={expandedOptions}
      onSelect={(items) => {
        console.log('onSelect', items);
        field.handleChange(items);
      }}
      selectedValues={field.state.value}
    />
  );
}

export default FormDropdownSelector;
