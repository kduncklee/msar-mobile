import type { CheckboxPropsCommon } from '@/components/inputs/Checkbox';
import Checkbox from '@/components/inputs/Checkbox';
import { useFieldContext } from '@/hooks/formContext';

function FormCheckbox({ ...checkboxProps }: CheckboxPropsCommon) {
  const field = useFieldContext<boolean>();

  return (
    <Checkbox
      {...checkboxProps}
      onToggle={field.handleChange}
      checked={field.state.value}
    />
  );
}

export default FormCheckbox;
