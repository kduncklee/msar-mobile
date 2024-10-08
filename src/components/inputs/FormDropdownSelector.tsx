import type { ReactFormApi } from '@tanstack/react-form';
import type { DeepKeyValueName } from '@/utility/reactForm';
import type { DropdownSelectorCommonProps } from '@/components/inputs/DropdownSelector';
import DropdownSelector from '@/components/inputs/DropdownSelector';

interface FormDropdownSelectorProps<
// eslint-disable-next-line ts/no-unnecessary-type-constraint
  TFormData extends unknown,
  TName extends DeepKeyValueName<TFormData, string>,
> extends DropdownSelectorCommonProps {
  form: ReactFormApi<TFormData, any>;
  name: TName;
};

function FormDropdownSelector<
  // eslint-disable-next-line ts/no-unnecessary-type-constraint
  TFormData extends unknown,
  TName extends DeepKeyValueName<TFormData, string>,
>({ form, name, options, ...dropdownProps }: FormDropdownSelectorProps<TFormData, TName>) {
  return (
    <form.Field<any, any, any>
      name={name}
      // eslint-disable-next-line react/no-children-prop
      children={(field) => {
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
      }}
    />
  );
}

export default FormDropdownSelector;
