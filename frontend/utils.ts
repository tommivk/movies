import camelcaseKeys from "camelcase-keys";
import useAppStore from "./src/store";
import { Notification } from "./types";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchData = async ({
  method,
  path,
  body,
  token,
}: {
  method?: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  path: string;
  body?: Record<string, unknown>;
  token?: string;
}) => {
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) {
    useAppStore.getState().setLoggedUser(null);
    localStorage.removeItem("loggedUser");
    throw new Error("Session expired");
  }

  if (!res.ok) {
    throw new Error(await res.json());
  }

  if (method == "DELETE") return;

  const json = await res.json();
  return camelcaseKeys(json, { deep: true });
};

export const getFullSizeImageUrl = (imagePath: string) => {
  if (!imagePath) return;
  return `https://image.tmdb.org/t/p/original/${imagePath}`;
};

export const getBackdropImageUrl = (
  imagePath: string,
  size: "xs" | "md" | "lg"
) => {
  if (!imagePath) return;
  switch (size) {
    case "xs":
      return `https://image.tmdb.org/t/p/w300/${imagePath}`;
    case "md":
      return `https://image.tmdb.org/t/p/w780/${imagePath}`;
    case "lg":
      return `https://image.tmdb.org/t/p/w1280/${imagePath}`;
  }
};

export const getPosterImageUrl = (
  imagePath: string,
  size: "xs" | "sm" | "md"
) => {
  if (!imagePath) return;
  switch (size) {
    case "xs":
      return `https://image.tmdb.org/t/p/w342/${imagePath}`;
    case "sm":
      return `https://image.tmdb.org/t/p/w500/${imagePath}`;
    case "md":
      return `https://image.tmdb.org/t/p/w780/${imagePath}`;
  }
};

export const getProfileImageUrl = (
  imagePath: string,
  size: "xs" | "xxs" | "md"
) => {
  if (!imagePath) return;
  switch (size) {
    case "xxs":
      return `https://image.tmdb.org/t/p/w45/${imagePath}`;
    case "xs":
      return `https://image.tmdb.org/t/p/w185/${imagePath}`;
    case "md":
      return `https://image.tmdb.org/t/p/h632/${imagePath}`;
  }
};

export const runtimeToString = (minutes: number) =>
  `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

export const getNotificationMessage = (
  notification: Notification
): { message: string; href?: string } => {
  const { firedByGroupId, firedByName, notificationType } = notification;

  switch (notificationType) {
    case "welcome":
      return { message: `Welcome to Mövies!` };
    case "friend_request":
      return {
        message: `You have a new friend request from ${firedByName}!`,
        href: "/me",
      };
    case "accepted_friend_request":
      return {
        message: `Your friend request was accepted by ${firedByName}!`,
        href: "/me",
      };
    case "denied_friend_request":
      return {
        message: `${firedByName} denied your friend request`,
        href: "/me",
      };
    case "new_movie_recommendation":
    default:
      return {
        message: `${firedByName}: New movie recommendation`,
        href: `/groups/${firedByGroupId}`,
      };
  }
};
