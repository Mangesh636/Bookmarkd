import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";

import * as z from "zod";

export type T = z.infer<typeof postThemeValidator>;

const storageKey = "_preferred-theme";
const postThemeValidator = z.union([z.literal("light"), z.literal("dark")]);

export const getThemeServerFn = createServerFn().handler(
	async () => (getCookie(storageKey) || "light") as T,
);

export const setThemeServerFn = createServerFn({ method: "POST" })
	.validator(postThemeValidator)
	.handler(async ({ data }) => setCookie(storageKey, data));
