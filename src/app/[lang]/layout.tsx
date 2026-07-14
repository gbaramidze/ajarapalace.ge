import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import GlobalHeader from "@/components/GlobalHeader";
import Footer from "@/components/Footer";
import { Providers } from "@/context/Providers";
import JsonLd from "@/components/JsonLd";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });

export const metadata: Metadata = {
  metadataBase: new URL('https://ajarapalace.ge'),
  title: {
    default: "Ajara Palace | Premium Restaurant & Hotel in Batumi",
    template: "%s | Ajara Palace"
  },
  description: "Experience the best of Georgian hospitality. Premium stays, authentic culinary delights, and luxury rooms in the heart of Batumi.",
  keywords: ["Ajara Palace", "Restaurant Batumi", "Hotel Batumi", "Georgian Cuisine", "Premium Hotel Batumi", "Batumi stay", "luxury dining", "food delivery Batumi", "Аджара Палас", "отель Батуми", "ресторан Батуми"],
  authors: [{ name: 'Ajara Palace' }],
  creator: 'Ajara Palace',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ajarapalace.ge',
    siteName: 'Ajara Palace',
    title: 'Ajara Palace | Premium Restaurant & Hotel in Batumi',
    description: 'Experience the best of Georgian hospitality. Premium stays, authentic culinary delights, and luxury rooms in the heart of Batumi.',
    images: [
      {
        url: '/screenshot-wide.jpg',
        width: 1920,
        height: 1080,
        alt: 'Ajara Palace Hotel and Restaurant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ajara Palace | Premium Restaurant & Hotel in Batumi',
    description: 'Experience the best of Georgian hospitality. Premium stays, authentic culinary delights, and luxury rooms in the heart of Batumi.',
    images: ['/screenshot-wide.jpg'],
  },
  icons: {
    icon: [
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/icons/favicon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/icons/favicon.ico'],
  }
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const resolvedParams = await params;
  
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ajara Palace",
    "url": "https://ajarapalace.ge",
    "logo": "https://ajarapalace.ge/new.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+995-555-19-85-75",
      "contactType": "customer service"
    }
  };

  return (
    <html lang={resolvedParams.lang || 'en'}>
      <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen bg-background text-foreground flex flex-col`}>
        <JsonLd schema={orgSchema} />
        <Providers>
          <GlobalHeader />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
