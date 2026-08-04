import { NextResponse } from 'next/server';

const API_KEY = "9e6d0d0adccd457490668c43e2ebc52b";
const TARGET_NUMBERS = ["995579205205", "995599777975", "995595178687"];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, zone, guests, date, time, comments } = body;

    if (!phone || !zone || !guests) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Format SMS Text
    let text = `[Table Reservation]\n`;
    if (name) text += `Name: ${name}\n`;
    text += `Phone: ${phone}\n`;
    text += `Location: ${zone}\n`;
    text += `Guests: ${guests}\n`;
    if (date) text += `Date: ${date}\n`;
    if (time) text += `Time: ${time}\n`;
    if (comments) text += `Wishes: ${comments}\n`;

    await Promise.all(TARGET_NUMBERS.map(async (targetNum) => {
      const queryParams = new URLSearchParams({
        key: API_KEY,
        destination: targetNum,
        sender: "ajarapalace",
        urgent: "true",
        content: text
      });

      const smsUrl = `http://smsoffice.ge/api/v2/send/?${queryParams.toString()}`;
      try {
        const response = await fetch(smsUrl, { method: 'GET' });
        if (!response.ok) {
          console.error(`SMS Error for ${targetNum}:`, await response.text());
        }
      } catch (err) {
        console.error(`SMS Fetch Error for ${targetNum}:`, err);
      }
    }));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reservation API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
