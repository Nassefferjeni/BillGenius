import React from "react";
import Container from "@/components/Container";

function Footer() {
  return (
    <footer className="mt-12 mb-8">
      <Container className="flex justify-between gap-4">
        <p className="text-sm">
          Invoicipedia &copy; {new Date().getFullYear()}
        </p>
        <p className="text-sm">Created by Nasef Ferjani</p>
      </Container>
    </footer>
  );
}

export default Footer;
