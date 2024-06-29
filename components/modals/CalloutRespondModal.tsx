import ButtonListModal from '@components/modals/ButtonListModal';
import colors from '@styles/colors';
import { responseType } from '@/types/enums';

interface CalloutRespondModalProps {
  modalVisible: boolean;
  onSelect: (value: any) => void;
  onCancel: () => void;
}

function CalloutRespondModal({
  modalVisible,
  onSelect,
  onCancel,
}: CalloutRespondModalProps) {
  const title = 'Respond:';
  const buttons = [
    {
      title: '10-19',
      value: responseType.TEN19,
      backgroundColor: colors.secondaryYellow,
      textColor: colors.black,
    },
    {
      title: '10-8',
      value: responseType.TEN8,
      backgroundColor: colors.green,
      textColor: colors.primaryText,
    },
    {
      title: '10-7',
      value: responseType.TEN7,
      backgroundColor: colors.red,
      textColor: colors.primaryText,
    },
  ];

  return (
    <ButtonListModal
      buttons={buttons}
      title={title}
      modalVisible={modalVisible}
      onSelect={onSelect}
      onCancel={onCancel}
    />
  );
}

export default CalloutRespondModal;
