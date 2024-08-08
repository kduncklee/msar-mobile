import ButtonListModal from '@components/modals/common/ButtonListModal';
import colors from '@styles/colors';

interface SnoozeModalProps {
  modalVisible: boolean;
  onSelect: (value: any) => void;
  onCancel: () => void;
};

function SnoozeModal({ modalVisible, onSelect, onCancel }: SnoozeModalProps) {
  const title = 'Snooze sounds for:';
  const buttons = [
    {
      title: '24 hours',
      value: 24 * 60,
      backgroundColor: colors.red,
      textColor: colors.primaryText,
    },
    {
      title: '8 hours',
      value: 8 * 60,
      backgroundColor: colors.secondaryYellow,
      textColor: colors.black,
    },
    {
      title: '2 hours',
      value: 2 * 60,
      backgroundColor: colors.secondaryYellow,
      textColor: colors.black,
    },
    {
      title: 'Resume sounds',
      value: 0,
      backgroundColor: colors.green,
      textColor: colors.primaryText,
    },
  ];

  return <ButtonListModal buttons={buttons} title={title} modalVisible={modalVisible} onSelect={onSelect} onCancel={onCancel} />;
}

export default SnoozeModal;
