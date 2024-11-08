import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-full">
      <Container className="flex justify-center text-center flex-col gap-8 h-full">
        <h1 className="text-5xl font-bold">Invoicipedia</h1>
        <p>
          <Button asChild>
            <Link href="/dashboard">Sign In</Link>
          </Button>
        </p>
      </Container>
    </main>
  );
}
