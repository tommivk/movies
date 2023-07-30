import { defineConfig } from "cypress";

export default defineConfig({
  video: false,
  e2e: {
    baseUrl: "http://localhost:5173",
  },
  env: {
    baseUrl: "http://localhost:5173",
  },
});
