export interface LabelValue {
  label: string;
  value: string | undefined; // Must be string to avoid Error while updating property 'accessibilityLabel' of a view managed by: RCTView
};

export function labelValueItem(name: string): LabelValue {
  return { label: name, value: name };
}
