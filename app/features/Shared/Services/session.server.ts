import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [process.env.APP_KEY || "STRONG_SECRET"],
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 15 Days
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
