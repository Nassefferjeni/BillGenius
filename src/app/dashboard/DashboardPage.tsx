"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { getInvoices } from "../actions";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DashboardPage({
  orgId,
  userId,
}: {
  userId: string | null;
  orgId: string | undefined | null;
}) {
  const { data } = useQuery({
    queryKey: [`invoices`, orgId, userId],
    queryFn: getInvoices,
  });

  const invoices = data?.map(({ invoices, customers }) => ({
    ...invoices,
    customer: customers,
  }));

  return (
    <main className="h-full">
      <Container>
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p>
            <Button className="inline-flex gap-2" variant="ghost" asChild>
              <Link href="invoices/new">
                <CirclePlus className="h-4 w-4" />
                Create Invoice
              </Link>
            </Button>
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-4" align="left">
                Date
              </TableHead>
              <TableHead className="p-4" align="left">
                Customer
              </TableHead>
              <TableHead className="p-4" align="left">
                Email
              </TableHead>
              <TableHead className="p-4" align="center">
                Status
              </TableHead>
              <TableHead className="p-4" align="right">
                Value
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices?.map((invoice) => (
              <TableRow
                key={invoice.id}
                className="cursor-pointer"
                onClick={() => redirect(`/invoices/${invoice.id}`)}
              >
                <TableCell className="font-medium text-left p-4">
                  <Link href="invoices/new" className="font-semibold">
                    {new Date(invoice.createTs).toLocaleDateString()}
                  </Link>
                </TableCell>
                <TableCell className="font-medium">
                  <span className="font-semibold">{invoice.customer.name}</span>
                </TableCell>
                <TableCell align="left">
                  <span className="font-semibold">
                    {invoice.customer.email}
                  </span>
                </TableCell>
                <TableCell align="left">
                  <span>
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
                  </span>
                </TableCell>
                <TableCell align="left">
                  <span>${invoice.value}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </main>
  );
}
