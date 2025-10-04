import type { DropdownMultiselectCommonProps } from '@/components/inputs/DropdownMultiselect';
import type { LabelValue } from '@/utility/reactForm';
import DropdownMultiselect from '@/components/inputs/DropdownMultiselect';
import { useFieldContext } from '@/hooks/formContext';

function FormDropdownSelector<
  TOption extends LabelValue,
>({ options, ...dropdownProps }: DropdownMultiselectCommonProps<TOption>) {
  const field = useFieldContext<string[]>();

  return (
    <DropdownMultiselect
      {...dropdownProps}
      options={options}
      onSelect={(items) => {
        console.log('onSelect', items);
        field.handleChange(items);
      }}
      selectedValues={field.state.value}
    />
  );
}

export default FormDropdownSelector;
