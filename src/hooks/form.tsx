import { createFormHook } from '@tanstack/react-form';
import { lazy } from 'react';
import { fieldContext, formContext } from './formContext';

const FormCheckbox = lazy(() => import('@/components/inputs/FormCheckbox'));
const FormDateTimePicker = lazy(() => import('@/components/inputs/FormDateTimePicker'));
const FormDropdownMultiselect = lazy(() => import('@/components/inputs/FormDropdownMultiselect'));
const FormDropdownSelector = lazy(() => import('@/components/inputs/FormDropdownSelector'));
const FormTextArea = lazy(() => import('@/components/inputs/FormTextArea'));
const FormTextInput = lazy(() => import('@/components/inputs/FormTextInput'));

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
