import InformationField from '@/components/fields/InformationField';
import { makePhoneCall, sendText } from '@/utility/phone';

interface InformationPhoneFieldProps {
  title?: string;
  value: string;
  valueColor?: string;
};

function InformationPhoneField({ title, value, valueColor }: InformationPhoneFieldProps) {
  return (
    <InformationField
      title={title}
      value={value}
      valueColor={valueColor}
      icon={require('@assets/icons/phone.png')}
      onIconPress={() => makePhoneCall(value)}
      secondaryIcon={require('@assets/icons/send_white.png')}
      onSecondaryIconPress={() => sendText(value)}
    />
  );
}
export default InformationPhoneField;
