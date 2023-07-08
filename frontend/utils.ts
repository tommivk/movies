import camelcaseKeys from "camelcase-keys";

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

  if (!res.ok) {
    throw new Error(await res.json());
  }

  if (method == "DELETE") return;

  const json = await res.json();
  return camelcaseKeys(json, { deep: true });
};

export const getImageUrl = (imagePath: string) =>
  `https://image.tmdb.org/t/p/original/${imagePath}`;

export const runtimeToString = (minutes: number) =>
  `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
