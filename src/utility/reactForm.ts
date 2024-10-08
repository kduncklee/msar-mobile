import type {
  DeepKeys,
  DeepValue,
} from '@tanstack/react-form';

type SelfKeys<T> = {
  [K in keyof T]: K
}[keyof T];

export type DeepKeyValueName<TFormData, TField> = SelfKeys<{
  [K in DeepKeys<TFormData> as DeepValue<TFormData, K> extends TField
    ? K
    : never]: K
}>;

export interface LabelValue {
  label: string;
  value: string;
};

export function labelValueItem(name: string): LabelValue {
  return { label: name, value: name };
}
