import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../../../utils";
import useAppStore from "../../store";
import LoadingContainer from "../LoadingContainer/LoadingContainer";
import { Friendships, User } from "../../../types";
import { toast } from "react-toastify";
import { useMemo } from "react";

import "./profilePage.scss";

const UserList = ({ friendships }: { friendships: Friendships }) => {
  const { token, userId } = useAppStore().loggedUser ?? {};
  const {
    data: allUsers,
    isLoading,
    isError,
  } = useQuery<User[]>({
    queryKey: ["getAllUsers"],
    queryFn: () => fetchData({ path: "/users", token }),
  });

  const queryClient = useQueryClient();

  const { mutate: addFriend } = useMutation({
    mutationKey: ["addFriend"],
    mutationFn: (userId: number) =>
      fetchData({
        method: "POST",
        path: `/users/me/friends`,
        body: { addresseeId: userId },
        token,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["getFriendships"]);
      toast.success("Friend request sent");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const users = useMemo(
    () => allUsers?.filter(({ id }) => id !== userId) ?? [],
    [allUsers, userId]
  );

  if (isLoading) return <LoadingContainer />;
  if (isError) return <div>Error...</div>;

  const friendsAndRequests = [
    ...friendships.friends,
    ...friendships.receivedRequests,
    ...friendships.sentRequests,
  ];

  return (
    <>
      <h1>All users</h1>
      <ul>
        {users.map((user) => {
          const isFriend = friendsAndRequests.find(({ id }) => id === user.id);
          return (
            <li key={user.id}>
              {user.username}
              {!isFriend && (
                <button onClick={() => addFriend(user.id)}>Add friend</button>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

const FriendList = ({ friendships }: { friendships: Friendships }) => {
  const queryClient = useQueryClient();

  const { token } = useAppStore().loggedUser ?? {};

  const { mutate: respondToFriendRequest } = useMutation({
    mutationKey: ["respondToFriendRequest"],
    mutationFn: ({
      userId,
      action,
    }: {
      userId: number;
      action: "accept" | "reject";
    }) =>
      fetchData({
        method: "PUT",
        path: `/users/me/friends/${userId}?action=${action}`,
        token,
      }),
    onSuccess: (_, { action }) => {
      toast.success(
        `Friend request ${action === "accept" ? "accepted" : "rejected"}`
      );
      queryClient.invalidateQueries(["getFriendships"]);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <>
      <h1>Your friends</h1>
      <ul>
        {friendships.friends.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>

      <h1>Received Friend Requests</h1>
      <ul>
        {friendships.receivedRequests.map((user) => (
          <li key={user.id}>
            {user.username}
            <button
              onClick={() =>
                respondToFriendRequest({ userId: user.id, action: "accept" })
              }
            >
              Accept
            </button>
            <button
              onClick={() =>
                respondToFriendRequest({ userId: user.id, action: "reject" })
              }
            >
              Reject
            </button>
          </li>
        ))}
      </ul>
      {friendships.receivedRequests.length === 0 && <p>No friend requests</p>}

      <h1>Sent friend Requests</h1>
      <ul>
        {friendships.sentRequests.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </>
  );
};

const ProfilePage = () => {
  const { userId, token } = useAppStore().loggedUser ?? {};

  const { data, isLoading, isError } = useQuery<Friendships>({
    queryKey: ["getFriendships", userId],
    queryFn: () => fetchData({ path: "/users/me/friends", token }),
  });

  if (isLoading) return <LoadingContainer />;
  if (isError) return <div>Error...</div>;

  return (
    <div className="profilePage">
      <UserList friendships={data} />
      <FriendList friendships={data} />
    </div>
  );
};

export default ProfilePage;
