import Modal from "../../../components/Modal/Modal";
import NewGroupForm from "./NewGroupForm";

const NewGroupModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal title={"Create New Group"} open={open} onClose={onClose}>
      <NewGroupForm onClose={onClose} />
    </Modal>
  );
};

export default NewGroupModal;
