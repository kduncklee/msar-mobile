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
      if (!expandedOptions.find(item => (item.label === name))) {
        expandedOptions.push(labelValueItem(name));
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
