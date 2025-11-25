export const metadata = {
  title: "Glamease - Beauty Services Platform",
  description: "Book beauty services from verified providers in Kenya",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
