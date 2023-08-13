import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Menu } from "@headlessui/react";
import { Notification } from "../../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchData } from "../../../utils";
import useAppStore from "../../store";
import useModalContext from "../../context/useModalContext";
import moment from "moment";
import Info from "../../icons/Info";
import Bell from "../../icons/Bell";
import classNames from "classnames";
import Button from "../Button/Button";

import "./navigation.scss";

const MenuItem = ({
  icon,
  href,
  text,
}: {
  icon: string;
  href: string;
  text: string;
}) => {
  return (
    <Menu.Item>
      <Link to={href} className="menuItem">
        <span>{icon}</span>
        {text}
      </Link>
    </Menu.Item>
  );
};

const Burger = () => {
  return (
    <div className="burger">
      <div />
      <div />
      <div />
    </div>
  );
};

const DropDown = ({
  menuButton,
  items,
  className,
}: {
  menuButton: React.ReactNode;
  items: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={className}>
      <Menu>
        <Menu.Button className="menuButton">{menuButton}</Menu.Button>
        <Menu.Items className="menu__items">{items}</Menu.Items>
      </Menu>
    </div>
  );
};

const BurgerDropDown = ({ handleLogOut }: { handleLogOut: () => void }) => {
  return (
    <DropDown
      className="burgerDropDown"
      menuButton={<Burger />}
      items={
        <>
          <MenuItem href="/search" icon="🔍" text="Search" />
          <MenuItem href="/favourites" icon="⭐" text="Favourites" />

          <button onClick={handleLogOut} className="menu__logout">
            <span className="logout__icon">⇤</span>
            Log out
          </button>
        </>
      }
    />
  );
};

const NotificationMessage = ({
  notification,
}: {
  notification: Notification;
}) => {
  const queryClient = useQueryClient();
  const { token } = useAppStore().loggedUser ?? {};
  const { mutate: handleSetSeen } = useMutation({
    mutationKey: ["handleSeen"],
    mutationFn: () =>
      fetchData({
        path: `/users/me/notifications/${notification.id}`,
        method: "PATCH",
        body: { seen: true },
        token,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["fetchUserData"]);
    },
  });

  const location = useLocation();
  const href =
    notification.notificationType !== "friend_request"
      ? "/users"
      : location.pathname;
  const seen = notification.seen;
  return (
    <Menu.Item>
      <Link
        className={classNames("notificationMessage", { seen: seen })}
        to={href}
        onClick={() => handleSetSeen()}
      >
        <div className="notificationMessage__icon">
          <Info />
        </div>
        <div>
          <p className="notificationMessage__message">{notification.message}</p>
          <p className="notificationMessage__date">
            {moment(notification.timestamp).fromNow()}
          </p>
        </div>
      </Link>
    </Menu.Item>
  );
};

const NotificationList = () => {
  const notifications = useAppStore().notifications;

  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/users");
  };

  const limit = 7;

  return (
    <div className="notificationList">
      {notifications.slice(0, limit).map((notification) => (
        <NotificationMessage
          key={notification.id}
          notification={notification}
        />
      ))}
      {notifications.length > limit && (
        <Menu.Item>
          <Button
            className="notificationList__button"
            color="transparent"
            size="sm"
            onClick={handleRedirect}
          >
            View all
          </Button>
        </Menu.Item>
      )}
    </div>
  );
};

const NotificationDropDown = () => {
  const notifications = useAppStore().notifications;
  const unread = notifications.filter((notification) => !notification.seen);
  return (
    <DropDown
      className="notificationDropdown"
      menuButton={
        <>
          <div className="notificationDropdown__bell">
            <Bell />

            {unread.length > 0 && (
              <span className="notificationDropdown__count">
                {unread.length}
              </span>
            )}
          </div>
        </>
      }
      items={<NotificationList />}
    />
  );
};

const Navigation = () => {
  const { openLoginModal } = useModalContext();

  const store = useAppStore();
  const setLoggedUser = store.setLoggedUser;

  const handleLogOut = () => {
    setLoggedUser(null);
    localStorage.removeItem("loggedUser");
    toast.success("Goodbye");
  };

  return (
    <div className="nav">
      <ul>
        <li>
          <Link to="/">
            <h1 className="nav__title">Mövies</h1>
          </Link>
        </li>

        <div className="nav__links">
          <li>
            <Link to="/search">Search</Link>
          </li>
          {store.loggedUser && (
            <li>
              <Link to="/users">Users</Link>
            </li>
          )}
        </div>

        {store.loggedUser ? (
          <div className="nav__buttons">
            <li>
              <NotificationDropDown />
            </li>
            <li>
              <BurgerDropDown handleLogOut={handleLogOut} />
            </li>
          </div>
        ) : (
          <li>
            <button
              className="btn btn--transparent"
              onClick={openLoginModal}
              data-cy="login"
            >
              Login
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navigation;
