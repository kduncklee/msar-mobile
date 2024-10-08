import type { ReactFormApi } from '@tanstack/react-form';
import type { DeepKeyValueName, LabelValue } from '@/utility/reactForm';
import type { DropdownMultiselectCommonProps } from '@/components/inputs/DropdownMultiselect';
import DropdownMultiselect from '@/components/inputs/DropdownMultiselect';

interface FormDropdownMultiselectProps<
// eslint-disable-next-line ts/no-unnecessary-type-constraint
  TFormData extends unknown,
  TName extends DeepKeyValueName<TFormData, string[]>,
  TOption extends LabelValue,
> extends DropdownMultiselectCommonProps<TOption> {
  form: ReactFormApi<TFormData, any>;
  name: TName;
};

function FormDropdownSelector<
  // eslint-disable-next-line ts/no-unnecessary-type-constraint
  TFormData extends unknown,
  TName extends DeepKeyValueName<TFormData, string[]>,
  TOption extends LabelValue,
>({ form, name, options, ...dropdownProps }: FormDropdownMultiselectProps<TFormData, TName, TOption>) {
  return (
    <form.Field<any, any, any>
      name={name}
      mode="array"
      // eslint-disable-next-line react/no-children-prop
      children={(field) => {
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
      }}
    />
  );
}

export default FormDropdownSelector;
