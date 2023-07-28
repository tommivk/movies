import camelcaseKeys from "camelcase-keys";
import useAppStore from "./src/store";

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

export const getSmallPosterImageUrl = (imagePath: string) => {
  if (!imagePath) return;
  return `https://image.tmdb.org/t/p/w500/${imagePath}`;
};

export const getSmallBackdropImageUrl = (imagePath: string) => {
  if (!imagePath) return;
  return `https://image.tmdb.org/t/p/w780/${imagePath}`;
};

export const getSmallProfileImageUrl = (imagePath: string) => {
  if (!imagePath) return;
  return `https://image.tmdb.org/t/p/w185/${imagePath}`;
};

export const runtimeToString = (minutes: number) =>
  `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
