import { Menu } from "@headlessui/react";
import classNames from "classnames";
import moment from "moment";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Bell from "../../icons/Bell";
import Info from "../../icons/Info";
import useAppStore from "../../store";
import Button from "../Button/Button";
import DropDownMenu from "../DropDownMenu/DropDownMenu";
import { Notification } from "../../../types";
import useSetNotificationSeen from "../../hooks/useSetNotificationSeen";
import { getNotificationMessage } from "../../../utils";

import "./notificationDropDown.scss";

const NotificationMessage = ({
  notification,
}: {
  notification: Notification;
}) => {
  const location = useLocation();
  const { token } = useAppStore().loggedUser ?? {};
  const { mutate: setNotificationSeen } = useSetNotificationSeen();
  const seen = notification.seen;
  const { message, href = location.pathname } =
    getNotificationMessage(notification);

  return (
    <Menu.Item>
      <Link
        className={classNames("notificationMessage", { seen: seen })}
        to={href}
        onClick={() =>
          setNotificationSeen({ notificationId: notification.id, token })
        }
      >
        <div className="notificationMessage__icon">
          <Info />
        </div>
        <div>
          <p className="notificationMessage__message">{message}</p>
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
    navigate("/me");
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
    <DropDownMenu
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

export default NotificationDropDown;
