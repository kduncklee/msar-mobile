export interface LabelValue {
  label: string;
  value: string | undefined;
};

export function labelValueItem(name: string): LabelValue {
  return { label: name, value: name };
}
