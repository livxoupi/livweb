import "./globals.css";
import Script from "next/script";

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
      <body>
        {children}
        <Script
          data-name="BMC-Widget"
          data-cfasync="false"
          src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
          data-id="LivXfun"
          data-description="Support me on Buy me a coffee!"
          data-message="Thank you for checking out my web page, lost some sleep so I need some coffee."
          data-color="#BD5FFF"
          data-position="Right"
          data-x_margin="18"
          data-y_margin="18"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
