import { useState } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../../../utils";
import Button from "../../../components/Button/Button";
import Container from "../../../components/Container/Container";
import FormInput from "../../../components/FormInput/FormInput";
import LoadingContainer from "../../../components/LoadingContainer/LoadingContainer";
import Modal from "../../../components/Modal/Modal";
import useGetAllGroups from "../hooks/useGetAllGroups";
import useJoinGroup from "../../../hooks/useJoinGroup";
import useLeaveGroup from "../../../hooks/useLeaveGroup";
import useAppStore from "../../../store";
import NewGroupModal from "./NewGroupModal";

const GroupList = ({ search = "" }: { search: string }) => {
  const [newGroupModalOpen, setNewGroupModalOpen] = useState(false);
  const [passwordModal, setPasswordModal] = useState<{
    groupId: number | undefined;
    isOpen: boolean;
  }>({
    groupId: undefined,
    isOpen: false,
  });
  const [password, setPassword] = useState("");

  const { token } = useAppStore().loggedUser ?? {};
  const { groups: usersGroups } = useAppStore();

  const {
    data: allGroups = [],
    isError,
    isLoading,
  } = useGetAllGroups(search, token);

  const { mutate: joinGroup } = useJoinGroup();
  const { mutate: leaveGroup } = useLeaveGroup();

  if (isError) {
    return <div>Error</div>;
  }
  if (isLoading) {
    return <LoadingContainer />;
  }

  const joinedGroupIds = usersGroups.map((group) => group.id);

  return (
    <Container>
      <div className="groupList">
        <NewGroupModal
          open={newGroupModalOpen}
          onClose={() => setNewGroupModalOpen(false)}
        />
        <Modal
          title="Join group"
          open={passwordModal.isOpen}
          onClose={() => {
            setPasswordModal({ groupId: undefined, isOpen: false });
            setPassword("");
          }}
        >
          <form
            className="groupList__passwordModal"
            onSubmit={(e) => {
              e.preventDefault();
              if (passwordModal.groupId === undefined) return;
              joinGroup(
                { groupId: passwordModal.groupId, password, token },
                {
                  onSuccess: () => {
                    setPasswordModal({ groupId: undefined, isOpen: false });
                  },
                }
              );
            }}
          >
            <FormInput
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={({ target }) => setPassword(target.value)}
            ></FormInput>
            <Button type="submit">Submit</Button>
          </form>
        </Modal>

        <Button
          size="sm"
          color="secondary"
          className="groupList__newGroupButton"
          onClick={() => setNewGroupModalOpen(true)}
        >
          Create New Group
        </Button>

        {allGroups.map((group) => (
          <Link to={`/groups/${group.id}`} key={group.id} className="link">
            <div className="groupList__group">
              <img
                className="groupList__image"
                src={getImageUrl(group.imagePath)}
              />
              <div className="groupList__bottomSection">
                <h3 className="groupList__title">{group.name}</h3>
                <p className="groupList__description">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Incidunt culpa voluptatem, est repellat similique ratione
                  dolorem vitae.
                </p>
                {joinedGroupIds.includes(group.id) ? (
                  <Button
                    color="transparent"
                    size="sm"
                    className="groupList__cardButton"
                    onClick={(e) => {
                      e.preventDefault();
                      const confirmed = window.confirm("Leave group?");
                      if (confirmed) {
                        leaveGroup({ groupId: group.id, token });
                      }
                    }}
                  >
                    Leave
                  </Button>
                ) : (
                  <Button
                    color="transparent"
                    size="sm"
                    className="groupList__cardButton"
                    onClick={(e) => {
                      e.preventDefault();
                      if (group.private) {
                        setPasswordModal({ isOpen: true, groupId: group.id });
                        return;
                      }
                      joinGroup({ groupId: group.id, token });
                    }}
                  >
                    {group.private && (
                      <span className="groupList__lockIcon">🔒</span>
                    )}
                    Join
                  </Button>
                )}
              </div>
            </div>
          </Link>
        ))}
        {allGroups.length === 0 && (
          <p className="notFoundText">No groups found</p>
        )}
      </div>
    </Container>
  );
};

export default GroupList;
