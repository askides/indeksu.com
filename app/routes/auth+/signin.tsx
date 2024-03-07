import type {
  ActionFunctionArgs,
  DataFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Button } from "~/features/Public/UI/Button";
import { FormGroup } from "~/features/Public/UI/FormGroup";
import { Input } from "~/features/Public/UI/Input";
import { Label } from "~/features/Public/UI/Label";
import { authenticator } from "~/features/Shared/Services/auth.server";
import {
  commitSession,
  getSession,
} from "~/features/Shared/Services/session.server";
import { createPageSeo } from "~/features/Shared/Utils/createPageSeo";

export const meta: MetaFunction = () => {
  const createdMeta = createPageSeo({
    title: `Sign In`,
    description: `Sign in and start indexing your websites faster.`,
    canonical: `/auth/signin`,
  });

  return createdMeta;
};

export async function loader({ request }: DataFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  });

  const cookie = await getSession(request.headers.get("cookie"));
  const authError = cookie.get(authenticator.sessionErrorKey);

  // Commit session to clear any `flash` error message.
  return json(
    { authError },
    {
      headers: {
        "set-cookie": await commitSession(cookie),
      },
    }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const redirectTo = formData.get("redirectTo") as string | undefined;

  return await authenticator.authenticate("form", request, {
    successRedirect: redirectTo ?? "/dashboard",
    failureRedirect: "/auth/signin",
    context: { formData },
  });
}

export default function Page() {
  const { authError } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full flex-1 justify-center sm:mx-auto sm:w-full sm:max-w-md sm:items-center">
      <div className="w-full sm:mx-auto sm:max-w-md">
        <div className="px-4 py-12 sm:px-10">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Sign In</h1>
            <p>
              Indeksu is a tool to help you index your websites on search
              engines faster.
            </p>
          </div>
          <Form method="POST" className="mt-6 flex flex-col space-y-6">
            {authError && (
              <div
                role="alert"
                className="bg-red-100 text-sm text-red-700 p-4 rounded-sm"
              >
                <p>{authError.message}</p>
              </div>
            )}

            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                required={true}
                placeholder="elon@tesla.com"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                required={true}
                minLength={8}
                placeholder="••••••••••"
              />
            </FormGroup>

            <input type="hidden" name="action" value="SIGN_IN" />
            <Button>Sign In</Button>

            <div>
              <p className="text-sm text-center">
                Don't have an account?{" "}
                <a
                  href="/auth/signup"
                  className="text-blue-500 hover:underline"
                >
                  Sign Up
                </a>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
