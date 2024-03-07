import type { User } from "@prisma/client";
import { compare, hash } from "bcrypt";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { email, minLength, object, safeParse, string } from "valibot";
import { db } from "~/database/client";
import { sessionStorage } from "./session.server";

export const authenticator = new Authenticator<User>(sessionStorage, {
  throwOnError: true,
});

authenticator.use(
  new FormStrategy(async ({ context }) => {
    const data = context?.formData as FormData;

    if (!data) {
      throw new Error("Invalid email or password.");
    }

    const mail = data.get("email") as string;
    const password = data.get("password") as string;
    const action = data.get("action") as "SIGN_IN" | "SIGN_UP";

    if (!mail || !password) {
      throw new Error("Invalid email or password.");
    }

    if (action === "SIGN_UP") {
      // Apply validation with valibot
      const schema = safeParse(
        object({
          email: string([email()]),
          password: string([minLength(8)]),
        }),
        { email: mail, password }
      );

      if (!schema.success) {
        throw new Error("Invalid email or password.");
      }

      const exists = await db.user.findUnique({
        where: {
          email: schema.output.email,
        },
      });

      if (exists) {
        throw new Error("User already exists, please sign in instead.");
      }

      return db.user.create({
        data: {
          email: schema.output.email,
          password: await hash(schema.output.password, 10),
        },
      });
    }

    if (action === "SIGN_IN") {
      const exists = await db.user.findUnique({
        where: {
          email: mail,
        },
      });

      if (exists && exists.password) {
        const isPasswordValid = await compare(password, exists.password);

        if (isPasswordValid) {
          return exists;
        }

        throw new Error("Invalid email or password.");
      }

      throw new Error("Invalid email or password.");
    }

    throw new Error("Invalid action.");
  })
);
