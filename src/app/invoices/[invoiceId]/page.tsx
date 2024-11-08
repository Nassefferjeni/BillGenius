import { auth } from "@clerk/nextjs/server";
import InvoicePage from "./InvoicePage";

export default async function Home({
  params,
}: {
  params: { invoiceId: string };
}) {
  const { invoiceId: invoiceIdStr } = params;
  const invoiceId = parseInt(invoiceIdStr);
  const authResult = await auth();
  const { userId, orgId } = authResult;

  if (isNaN(invoiceId)) {
    throw new Error(`Invoice ID must be a number`);
  }

  if (!invoiceId) {
    return null;
  }

  return <InvoicePage invoiceId={invoiceId} userId={userId} orgId={orgId} />;
}
