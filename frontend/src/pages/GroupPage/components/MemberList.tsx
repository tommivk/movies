import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer";
import Modal from "../../../components/Modal/Modal";
import useGetGroupMembers from "../hooks/useGetGroupMembers";

const MemberList = ({
  groupId,
  isOpen,
  onClose,
}: {
  groupId: number;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const { data: members, isLoading, isError } = useGetGroupMembers(groupId);

  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={`Group Members (${members?.length})`}
    >
      {isLoading ? (
        <LoadingContainer />
      ) : (
        <div className="groupMemberList">
          {members.map((member) => (
            <div key={member.id} className="groupMemberList__member">
              <img />
              <p>{member.username}</p>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default MemberList;
