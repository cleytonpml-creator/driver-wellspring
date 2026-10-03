import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";



export const getLangCookie = createServerFn({ method: "GET" }).handler(async () => {
  return getCookie("driverpulse_lang") ?? "pt";
});
