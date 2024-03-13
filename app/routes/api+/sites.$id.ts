import { ActionFunctionArgs, json } from "@remix-run/node";
import { number, object, parse } from "valibot";
import { db } from "~/database/client";
import { authenticator } from "~/features/Shared/Services/auth.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/signin",
  });

  const data = await request.json();
  const valid = parse(object({ status: number() }), data);

  const site = await db.site.findFirstOrThrow({
    where: { id: params.id, user_id: session.id },
  });

  await db.site.update({
    where: { id: site.id },
    data: { status: valid.status },
  });

  return json({ message: "Operation Successful." });
}
