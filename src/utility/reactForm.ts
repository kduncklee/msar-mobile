export interface LabelValue {
  label: string;
  value: string | number | undefined;
};

export function labelValueItem(name: string): LabelValue {
  return { label: name, value: name };
}
