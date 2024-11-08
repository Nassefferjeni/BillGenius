import PaymentPage from "./PaymentPage";

export default async function Payment({
  params,
  searchParams,
}: {
  params: { invoiceId: string };
  searchParams: { status: string; session_id: string };
}) {
  const { invoiceId: invoiceIdStr } = await params;
  const invoiceId = parseInt(invoiceIdStr);

  if (isNaN(invoiceId)) {
    throw new Error(`Invoice ID must be a number`);
  }

  const awaitedParams = await searchParams;
  const sessionId = awaitedParams.session_id;

  return (
    <PaymentPage
      invoiceId={invoiceId}
      isSuccess={awaitedParams.status === "success" && !!sessionId}
      isCancelled={awaitedParams.status === "canceled" && !!sessionId}
      isError={awaitedParams.status === "success" && !sessionId}
    />
  );
}
