import PaymentPage from "./PaymentPage";

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ invoiceId: string }>;
  searchParams: Promise<{ status: string; session_id: string }>;
}) => {
  const invoiceId = (await params).invoiceId;
  const invoiceIdNumber = parseInt(invoiceId);
  const { session_id: sessionId, status } = await searchParams;

  if (isNaN(invoiceIdNumber)) {
    throw new Error(`Invoice ID must be a number`);
  }

  if (!invoiceIdNumber || !status) {
    return null;
  }

  return (
    <PaymentPage
      invoiceId={invoiceIdNumber}
      isSuccess={status === "success" && !!sessionId}
      isCancelled={status === "canceled" && !!sessionId}
      isError={status === "success" && !sessionId}
    />
  );
};

export default Page;
