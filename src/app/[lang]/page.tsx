import React from 'react';
import HomePageContent from '@/components/HomePageContent';
import { Category } from '@/types';
import JsonLd from '@/components/JsonLd';

const RESTIQ_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc5OTA3NTQ0LCJleHAiOjE5Mzc1ODc1NDR9.ir1IQCX9eJf2EZQ0IOKLY0zoXAN9J4IEbMRUZQBEHUE';
const TENANT_ID = '00000000-0000-0000-0000-000000000001';

async function getCategories(): Promise<Category[]> {
  try {
    const headers = { 
      'Authorization': `Bearer ${RESTIQ_TOKEN}`, 
      'apikey': RESTIQ_TOKEN 
    };
    
    const [catRes, itemRes] = await Promise.all([
      fetch(
        `https://api.restiq.ge/rest/v1/categories?select=*&tenant_id=eq.${TENANT_ID}&disable=neq.1`,
        { headers, next: { revalidate: 3600 } }
      ),
      fetch(
        `https://api.restiq.ge/rest/v1/items?select=*&tenant_id=eq.${TENANT_ID}&disable=neq.1`,
        { headers, next: { revalidate: 3600 } }
      )
    ]);
    
    if (!catRes.ok || !itemRes.ok) throw new Error('Failed to fetch from Restiq');
    
    const rawCategories = await catRes.json();
    const rawItems = await itemRes.json();
    
    const parsedItems: Record<string, typeof rawItems> = {};
    rawItems.forEach((item: any) => {
      if (item.disable == 1) return;
      
      const parsedItem = {
        id: String(item.id),
        name: (item.name || '').trim(),
        name_en: (item.name_en || '').trim(),
        name_ru: (item.name_ru || '').trim(),
        price: String(item.price),
        thumb: item.image_url || '',
      };

      const catIds = item.category ? item.category.split(',').filter(Boolean) : [];
      catIds.forEach((catId: string) => {
        if (!parsedItems[catId]) parsedItems[catId] = [];
        parsedItems[catId].push(parsedItem);
      });
    });

    const categories: Category[] = rawCategories
      .sort((a: any, b: any) => (a.sort || 0) - (b.sort || 0))
      .map((cat: any) => ({
        id: String(cat.id),
        type: cat.type || '',
        name: (cat.name || '').trim(),
        name_en: (cat.name_en || '').trim(),
        name_ru: (cat.name_ru || '').trim(),
        items: parsedItems[String(cat.id)] || []
      }))
      .filter((cat: Category) => cat.items.length > 0);

    return categories;
  } catch (error) {
    console.error("Error fetching menu:", error);
    return [];
  }
}

export default async function Home() {
  const categories = await getCategories();

  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Ajara Palace Restaurant",
    "image": "https://ajarapalace.ge/main.png",
    "servesCuisine": "Georgian",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Pushkin st. 154B",
      "addressLocality": "Batumi",
      "postalCode": "6000",
      "addressCountry": "GE"
    },
    "telephone": "+995555198575",
    "menu": "https://ajarapalace.ge/",
    "acceptsReservations": "True"
  };

  return (
    <>
      <JsonLd schema={restaurantSchema} />
      <HomePageContent categories={categories} />
    </>
  );
}
