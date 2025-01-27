import ButtonListModal from '@components/modals/common/ButtonListModal';
import colors, { textColorForBackground } from '@styles/colors';
import { useCalloutResponsesAvailableQuery } from '@/remote/query';

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
  const calloutResponesQuery = useCalloutResponsesAvailableQuery();

  const buttons = [];
  if (calloutResponesQuery.data) {
    calloutResponesQuery.data.results.forEach((data: any) => {
      const backgroundColor: string = data.color ?? colors.white;
      buttons.push({
        title: data.response,
        value: data.response,
        backgroundColor,
        textColor: textColorForBackground(backgroundColor),
      });
    });
  }

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
