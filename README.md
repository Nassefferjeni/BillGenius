# BillGenius

**A Modern Invoicing Application**

InvoiceZen is a powerful and intuitive invoicing application built with Next.js, Tailwind CSS, and Xata. It allows you to create, manage, and track your invoices efficiently.

**Key Features**

- User-friendly interface
- Create and manage invoices
- Secure payments through Stripe
- Real-time updates
- Robust data storage with Xata
- User authentication with Clerk

**Getting Started**

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Nassefferjeni/BillGenius.git
   ```

2. **Navigate to the Project Directory and install dependencies:**

   ```bash
   cd BillGenius
   pnpm install
   ```

- If the pnpm install didn't work you can also use this command:
  ```bash
    npm config set legacy-peer-deps true
  ```

3. **Create a .env.local file in the root directory of your project and add the following environment variables:**

   ```bash
   XATA_DATABASE_URL=your_xata_database_url
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/dashboard"  

   NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
   STRIPE_API_KEY=your_stripe_api_key
   ```

4. **Start the Development Server:**

   ```bash
   pnpm dev
   ```

Deployment

To deploy your InvoiceZen application, you can use Vercel, Netlify, or any other platform that supports Next.js. Follow the specific deployment instructions for your chosen platform.
