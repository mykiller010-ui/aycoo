import { defineConfig } from "vite";

export default defineConfig({
  // "./" = relative asset paths — works both at /aycoo/ and at aycoo.aynoo.net/
  base: "./",
  build: {
    target: "es2022",
  },
});
