import type {
  ActionFunctionArgs,
  DataFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useCallback, useEffect, useRef } from "react";
import { Button } from "~/features/Public/UI/Button";
import { FormGroup } from "~/features/Public/UI/FormGroup";
import { Input } from "~/features/Public/UI/Input";
import { Label } from "~/features/Public/UI/Label";
import { authenticator } from "~/features/Shared/Services/auth.server";
import { createPageSeo } from "~/features/Shared/Utils/createPageSeo";
import { useWaitingClick } from "~/features/Shared/Utils/useWaitingClick";

export const meta: MetaFunction = () => {
  const createdMeta = createPageSeo({
    title: `Email Confirmation`,
    description: `Confirm your email to get started.`,
    canonical: `/auth/email`,
  });

  return createdMeta;
};

export async function loader({ request }: DataFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/signin",
  });

  if (session.is_verified === true) {
    return redirect("/dashboard");
  }

  return json({ email: session.email });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const redirectTo = formData.get("redirectTo") as string | undefined;

  return await authenticator.authenticate("form", request, {
    successRedirect: redirectTo ?? "/dashboard",
    failureRedirect: "/auth/signup",
    context: { formData },
  });
}

export function useEffectAfterMount(callback: () => void) {
  const hasMounted = useRef(false);

  useEffect(() => {
    if (hasMounted.current) {
      callback();
    } else {
      hasMounted.current = true;
    }
  }, [callback]);
}

export default function Page() {
  const { email } = useLoaderData<typeof loader>();

  const sendVerificationEmail = useCallback(async () => {
    const res = await fetch("/auth/verify", {
      method: "POST",
    });

    if (!res.ok) {
      console.error("Failed to send email...");
      return;
    }

    console.log("Email sent...");
  }, []);

  const { isStale, isFetching, seconds, onClick } = useWaitingClick(
    async () => sendVerificationEmail(),
    10
  );

  useEffectAfterMount(() => {
    sendVerificationEmail();
  });

  return (
    <div className="flex h-full flex-1 justify-center sm:mx-auto sm:w-full sm:max-w-md sm:items-center">
      <div className="w-full sm:mx-auto sm:max-w-md">
        <div className="px-4 py-12 sm:px-10">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Check Your Email Inbox!
            </h1>
            <p>Click the link in the email to enable your account.</p>
          </div>
          <div className="mt-6 flex flex-col space-y-6">
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                defaultValue={email}
                readOnly={true}
                placeholder="elon@tesla.com"
              />
            </FormGroup>

            <Button
              type="button"
              disabled={isStale || isFetching}
              onClick={onClick}
            >
              {isFetching
                ? "Sending Email.."
                : isStale
                ? `Resend Email in ${seconds}s`
                : "Resend Email"}
            </Button>

            <div>
              <p className="text-sm text-center">
                Didn't receive the email?{" "}
                <span className="text-blue-500">Check your spam folder.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
