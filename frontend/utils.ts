import camelcaseKeys from "camelcase-keys";

export const fetchData = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const data = await res.json();
  return camelcaseKeys(data, { deep: true });
};
