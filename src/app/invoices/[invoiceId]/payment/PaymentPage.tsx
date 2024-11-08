"use client";

import {
  createPayment,
  getInvoiceForPayment,
  updateInvoice,
} from "@/app/actions";
import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, CreditCard } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect } from "react";

export default function PaymentPage({
  invoiceId,
  isSuccess,
  isCancelled,
  isError,
}: {
  invoiceId: number;
  isSuccess?: boolean;
  isCancelled?: boolean;
  isError?: boolean;
}) {
  const queryClient = useQueryClient();

  const { mutate: paymentSuccessfullMutate } = useMutation({
    mutationFn: () => updateInvoice({ id: invoiceId, status: "paid" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices", invoiceId] });
      queryClient.refetchQueries({ queryKey: ["invoices", invoiceId] });
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createPayment,
  });

  // Get the invoice data
  const { data, isLoading } = useQuery({
    queryKey: [`invoices`, invoiceId],
    queryFn: () => getInvoiceForPayment(invoiceId),
  });

  const invoice = {
    ...data,
    customer: {
      name: data?.name,
    },
  };

  // Run mutation if `isSuccess` is true on page load
  useEffect(() => {
    if (isSuccess && data?.status !== "paid") {
      paymentSuccessfullMutate();
    }
  }, [isSuccess, data]);

  async function onSubmit() {
    mutate(invoiceId);
  }

  if (isLoading) {
    return null;
  }

  if (!isLoading && !data) {
    notFound();
  }

  return (
    <main className="h-full w-full">
      <Container>
        {isError && (
          <p className="bg-red-100 text-sm text-red-800 text-center px-3 py-2 rounded-lg mb-6">
            Something Went wrong please try again.
          </p>
        )}
        {isCancelled && (
          <p className="bg-yellow-100 text-sm text-yellow-800 text-center px-3 py-2 rounded-lg mb-6">
            Payment was canceled, please try again.
          </p>
        )}
        <div className="grid grid-cols-2">
          <div>
            <div className="flex justify-between mb-8">
              <h1 className="flex items-center gap-4 text-3xl font-semibold">
                Invoice {invoiceId}
                <Badge
                  className={cn(
                    "rounded-full capitalize",
                    invoice.status === "open" && "bg-blue-500",
                    invoice.status === "paid" && "bg-green-600",
                    invoice.status === "void" && "bg-zinc-700",
                    invoice.status === "uncollectible" && "bg-red-600"
                  )}
                >
                  {invoice.status}
                </Badge>
              </h1>
            </div>

            <p className=" text-3xl mb-3">${invoice.value}</p>
            <p className=" text-3xl mb-8">{invoice.description}</p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Manage Invoice</h2>
            {invoice.status === "open" && (
              <form action={onSubmit}>
                <Button
                  className="flex gap-2 font-bold bg-green-700"
                  disabled={isPending}
                >
                  <CreditCard className="w-5 h-auto" />
                  Pay Invoice
                </Button>
              </form>
            )}
            {invoice.status === "paid" && (
              <p className="text-xl font-bold flex gap-2 items-center">
                <Check className="w-8 h-auto bg-green-500 rounded-full text-white p-1" />
                Payment has already been made.
              </p>
            )}
          </div>
        </div>

        <h2 className="font-bold text-lg mb-4">Billing Details</h2>

        <ul className="grid gap-2">
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice ID
            </strong>
            <span>{invoice.id}</span>
          </li>

          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice Date
            </strong>
            <span>
              {invoice.createTs
                ? new Date(invoice.createTs).toLocaleDateString()
                : ""}
            </span>
          </li>

          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Name
            </strong>
            <span>{invoice.customer?.name}</span>
          </li>
        </ul>
      </Container>
    </main>
  );
}
