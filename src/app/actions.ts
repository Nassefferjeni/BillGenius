"use server";

import { eq, and, isNull } from "drizzle-orm";
import { z } from "zod";
import { formSchema } from "./invoices/new/page";
import { Customers, Invoices, Status } from "@/db/schema";
import { db } from "@/db";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(String(process.env.STRIPE_API_KEY));

export async function addInvoice(values: z.infer<typeof formSchema>) {
  const authResult = await auth();
  const { userId, orgId } = authResult;

  if (!userId) return;

  const [customer] = await db
    .insert(Customers)
    .values({
      name: values.name,
      email: values.email,
      userId,
      organizationId: orgId ?? null,
    })
    .returning({
      id: Customers.id,
    });

  const results = await db
    .insert(Invoices)
    .values({
      value: Math.floor(parseFloat(values.value) * 100),
      description: values.description,
      userId,
      organizationId: orgId ?? null,
      customerId: customer.id,
      status: "open",
    })
    .returning({
      id: Invoices.id,
    });

  redirect(`/invoices/${results[0].id}`);
}

export async function getInvoices() {
  const authResult = await auth();
  const { userId, orgId } = authResult;

  if (!userId) return;

  let results = [];

  if (orgId) {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(eq(Invoices.organizationId, orgId));
  } else {
    results = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(and(eq(Invoices.userId, userId), isNull(Invoices.organizationId)));
  }

  if (!results) {
    notFound();
  }

  return results;
}

export async function getInvoice(id: number) {
  const authResult = await auth();
  const { userId, orgId } = authResult;

  if (!userId) return;

  let result;

  if (orgId) {
    [result] = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(and(eq(Invoices.id, id), eq(Invoices.organizationId, orgId)))
      .limit(1);
  } else {
    [result] = await db
      .select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        and(
          eq(Invoices.id, id),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      )
      .limit(1);
  }

  if (!result) {
    notFound();
  }

  return result;
}

export async function updateInvoice({
  id,
  status,
}: {
  id: number;
  status: Status;
}) {
  const authResult = await auth();
  const { userId, orgId } = authResult;

  if (!userId) return;

  if (orgId) {
    await db
      .update(Invoices)
      .set({
        status,
      })
      .where(and(eq(Invoices.id, id), eq(Invoices.organizationId, orgId)))
      .returning({
        id: Invoices.id,
      });
  } else {
    await db
      .update(Invoices)
      .set({
        status,
      })
      .where(
        and(
          eq(Invoices.id, id),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      )
      .returning({
        id: Invoices.id,
      });
  }
}

export async function deleteInvoice(id: number) {
  const authResult = await auth();
  const { userId, orgId } = authResult;

  if (!userId) return;

  if (orgId) {
    await db
      .delete(Invoices)
      .where(and(eq(Invoices.id, id), eq(Invoices.organizationId, orgId)));
  } else {
    await db
      .delete(Invoices)
      .where(
        and(
          eq(Invoices.id, id),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      );
  }

  redirect(`/dashboard`);
}

export async function getInvoiceForPayment(id: number) {
  const [result] = await db
    .select({
      id: Invoices.id,
      status: Invoices.status,
      createTs: Invoices.createTs,
      description: Invoices.description,
      value: Invoices.value,
      name: Customers.name,
    })
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.id, id))
    .limit(1);

  if (!result) {
    notFound();
  }

  return result;
}

export async function createPayment(id: number) {
  // Fetching headers list
  const headersList = headers();
  const req = await headersList;
  const origin = req.get("origin");

  const [result] = await db
    .select({
      status: Invoices.status,
      value: Invoices.value,
    })
    .from(Invoices)
    .where(eq(Invoices.id, id))
    .limit(1);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          // TODO: Make sure you add this product is STRIPE
          product: "prod_RB0nGfxS1qhtVM",
          unit_amount: result.value,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/invoices/${id}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/invoices/${id}/payment?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  redirect(session.url);
}
