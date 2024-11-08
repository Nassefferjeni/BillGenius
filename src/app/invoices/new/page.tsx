"use client";

import { addInvoice } from "@/app/actions";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  value: z.string(),
  description: z.string().min(1),
});

export default function CreateInvoice() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      value: "",
      description: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: addInvoice,
  });

  const {
    formState: { errors },
  } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values);
  }

  return (
    <main className="h-full">
      <Container>
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold">Create Invoice</h1>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 max-w-xs"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-2 font-semibold">
                    Billing Name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-2 font-semibold">
                    Billing Email
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-2 font-semibold">
                    Value
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block mb-2 font-semibold">
                    Description
                  </FormLabel>

                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="relative w-full font-semibold"
              disabled={!!Object.keys(errors).length || isPending}
            >
              <span className={isPending ? "text-transparent" : ""}>
                Submit
              </span>
              {isPending && (
                <span className="absolute flex items-center justify-center w-full h-full text-gray-400">
                  <LoaderCircle className="animate-spin" />
                </span>
              )}
            </Button>
          </form>
        </Form>
      </Container>
    </main>
  );
}
