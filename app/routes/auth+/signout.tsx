import type { DataFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/features/Shared/Services/auth.server";

export async function action({ request }: DataFunctionArgs) {
  return await authenticator.logout(request, { redirectTo: "/" });
}

export default function Page() {
  return (
    <div className="flex h-screen flex-row items-center justify-center">
      Whops! You should have already been redirected.
    </div>
  );
}
