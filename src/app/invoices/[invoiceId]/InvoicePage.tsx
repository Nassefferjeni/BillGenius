"use client";

import { deleteInvoice, getInvoice, updateInvoice } from "@/app/actions";
import Container from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AVAILABLE_STATUSES } from "@/data/invoices";
import { ChevronDown, CreditCard, Ellipsis, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function InvoicePage({
  invoiceId,
  userId,
  orgId,
}: {
  invoiceId: number;
  userId: string | null;
  orgId: string | undefined | null;
}) {
  const { data, isLoading } = useQuery({
    queryKey: [`invoices`, invoiceId, userId, orgId],
    queryFn: () => getInvoice(invoiceId),
  });

  const invoice = {
    ...data?.invoices,
    customer: data?.customers,
  };

  const queryClient = useQueryClient();

  const { mutate: updateInvoiceMutate } = useMutation({
    mutationFn: updateInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  const { mutate: deleteInvoiceMutate } = useMutation({
    mutationFn: deleteInvoice,
  });

  const onChangeStatus = (statusId: string) => {
    updateInvoiceMutate({ id: invoiceId, status: statusId });
  };

  const onDeleteInvoice = () => {
    deleteInvoiceMutate(invoiceId);
  };

  if (isLoading) {
    return null;
  }

  if (!isLoading && !data) {
    notFound();
  }

  return (
    <main className="h-full w-full">
      <Container>
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
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  Change Status
                  <ChevronDown className="w-4 h-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {AVAILABLE_STATUSES.map((status) => (
                  <DropdownMenuItem
                    key={status.id}
                    onClick={() => onChangeStatus(status.id)}
                  >
                    {status.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <span className="sr-only">More options</span>
                    <Ellipsis className="w-4 h-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <DialogTrigger className="flex gap-4 items-center">
                      <Trash2 className="w-4 h-auto" />
                      Delete Invoice
                    </DialogTrigger>
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <Link
                      href={`/invoices/${invoice.id}/payment`}
                      className="flex gap-4 items-center"
                    >
                      <CreditCard className="w-4 h-auto" />
                      Payment
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent className="bg-white">
                <DialogHeader className="gap-2 flex items-center">
                  <DialogTitle className="text-2xl">
                    Delete Invoice?
                  </DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your invoice and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    className="gap-2 items-center justify-center"
                    onClick={onDeleteInvoice}
                  >
                    <Trash2 className="w-4 h-auto" />
                    Delete Invoice
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <p className=" text-3xl mb-3">${invoice.value}</p>
        <p className=" text-3xl mb-8">{invoice.description}</p>

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

          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Email
            </strong>
            <span>{invoice.customer?.email}</span>
          </li>
        </ul>
      </Container>
    </main>
  );
}
