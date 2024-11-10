import { auth } from "@clerk/nextjs/server";
import InvoicePage from "./InvoicePage";

const Page = async ({ params }: { params: Promise<{ invoiceId: string }> }) => {
  const invoiceId = (await params).invoiceId;
  const invoiceIdNumber = parseInt(invoiceId);
  const authResult = await auth();
  const { userId, orgId } = authResult;

  if (isNaN(invoiceIdNumber)) {
    throw new Error(`Invoice ID must be a number`);
  }

  if (!invoiceIdNumber) {
    return null;
  }

  return (
    <InvoicePage invoiceId={invoiceIdNumber} userId={userId} orgId={orgId} />
  );
};

export default Page;
