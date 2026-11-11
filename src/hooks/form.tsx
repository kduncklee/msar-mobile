import { createFormHook } from '@tanstack/react-form';
import FormCheckbox from '@/components/inputs/FormCheckbox';
import FormDateTimePicker from '@/components/inputs/FormDateTimePicker';
import FormDropdownMultiselect from '@/components/inputs/FormDropdownMultiselect';
import FormDropdownSelector from '@/components/inputs/FormDropdownSelector';
import FormTextArea from '@/components/inputs/FormTextArea';
import FormTextInput from '@/components/inputs/FormTextInput';
import { fieldContext, formContext } from './formContext';

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    FormCheckbox,
    FormDateTimePicker,
    FormDropdownMultiselect,
    FormDropdownSelector,
    FormTextArea,
    FormTextInput,
  },
  formComponents: {
  },
  fieldContext,
  formContext,
});
