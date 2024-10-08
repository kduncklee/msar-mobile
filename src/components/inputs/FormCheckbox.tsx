import type { ReactFormApi } from '@tanstack/react-form';
import type { DeepKeyValueName } from '@/utility/reactForm';
import type { CheckboxPropsCommon } from '@/components/inputs/Checkbox';
import Checkbox from '@/components/inputs/Checkbox';

interface FormCheckboxProps<
// eslint-disable-next-line ts/no-unnecessary-type-constraint
  TFormData extends unknown,
  TName extends DeepKeyValueName<TFormData, boolean>,
> extends CheckboxPropsCommon {
  form: ReactFormApi<TFormData, any>;
  name: TName;
}

function FormCheckbox<
  // eslint-disable-next-line ts/no-unnecessary-type-constraint
  TFormData extends unknown,
  TName extends DeepKeyValueName<TFormData, boolean>,
>({ form, name, ...checkboxProps }: FormCheckboxProps<TFormData, TName>) {
  return (
    <form.Field<any, any, any>
      name={name}
      // eslint-disable-next-line react/no-children-prop
      children={(field) => {
        return (
          <Checkbox
            {...checkboxProps}
            onToggle={field.handleChange}
            checked={field.state.value}
          />
        );
      }}
    />
  );
}

export default FormCheckbox;
