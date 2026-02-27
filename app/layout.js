import "./globals.css";
export const metadata = {
  title: "Liv ✦ — Style Analysis",
  description: "Outfit ratings for elegance & true baddies. Upload a photo, get your verdict.",
  openGraph: {
    title: "Liv ✦ — Style Analysis",
    description: "Outfit ratings for elegance & true baddies.",
    url: "https://livwebstyles.vercel.app",
    siteName: "Liv ✦",
    images: [
      {
        url: "https://livwebstyles.vercel.app/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Liv ✦ — Style Analysis",
    description: "Outfit ratings for elegance & true baddies.",
    images: ["https://livwebstyles.vercel.app/og-image.png"],
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@200;300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
