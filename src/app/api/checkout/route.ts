import { NextResponse } from 'next/server';

const RESTIQ_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc5OTA3NTQ0LCJleHAiOjE5Mzc1ODc1NDR9.ir1IQCX9eJf2EZQ0IOKLY0zoXAN9J4IEbMRUZQBEHUE';
const TENANT_ID = '00000000-0000-0000-0000-000000000001';
const HEADERS = {
  'Authorization': `Bearer ${RESTIQ_TOKEN}`,
  'apikey': RESTIQ_TOKEN,
  'Content-Type': 'application/json'
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, total, phone, street, building, apartment, floor, comments, cart } = body;

    // 1. Format Guest Name as JSON string (Phone, Address, Comment)
    let addressFull = street;
    if (building) addressFull += `, Bldg ${building}`;
    if (apartment) addressFull += `, Apt ${apartment}`;
    if (floor) addressFull += `, Fl ${floor}`;

    const guestDetails = JSON.stringify({
      phone: phone || "",
      address: addressFull || "",
      comment: comments || ""
    });

    // 2. Fetch Active Shift
    const shiftRes = await fetch(`https://api.restiq.ge/rest/v1/shifts?select=id,opened_by&tenant_id=eq.${TENANT_ID}&status=eq.open&order=id.desc&limit=1`, {
      headers: HEADERS
    });
    
    if (!shiftRes.ok) throw new Error("Failed to fetch shift from Restiq");
    const shifts = await shiftRes.json();
    
    // If no shift is found, we'll gracefully fallback to creator = 1 and shift_id = null
    const activeShift = shifts.length > 0 ? shifts[0] : { id: null, opened_by: 1 };

    // 3. Create Order
    const orderPayload = {
      status: 'open',
      price: parseFloat(total),
      orders_total: parseFloat(total),
      creator: activeShift.opened_by,
      shift_id: activeShift.id,
      tenant_id: TENANT_ID,
      is_delivery: true,
      guest_name: guestDetails,
      table: null
    };

    const orderCreateRes = await fetch(`https://api.restiq.ge/rest/v1/orders`, {
      method: 'POST',
      headers: { ...HEADERS, 'Prefer': 'return=representation' },
      body: JSON.stringify(orderPayload)
    });

    if (!orderCreateRes.ok) {
      console.error("Order creation failed", await orderCreateRes.text());
      throw new Error("Failed to insert order");
    }

    const insertedOrderArr = await orderCreateRes.json();
    const insertedOrder = insertedOrderArr[0];

    // 4. Create Order List (Cart Items)
    const orderListPayload = cart.map((item: any) => ({
      orderID: insertedOrder.id,
      item: parseInt(item.id, 10),
      count: item.quantity,
      price: parseFloat(item.price),
      message: "",
      type: "restourant",
      creator: activeShift.opened_by,
      shift_id: activeShift.id,
      tenant_id: TENANT_ID,
      table: null
    }));

    const orderListRes = await fetch(`https://api.restiq.ge/rest/v1/order_list`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(orderListPayload)
    });

    if (!orderListRes.ok) {
      console.error("Order list creation failed", await orderListRes.text());
    }

    // 5. Send SMS to all receivers
    const API_KEY = "9e6d0d0adccd457490668c43e2ebc52b";
    const TARGET_NUMBERS = ["995579205205", "995599777975", "995595178687"];

    let text = `New Order #${insertedOrder.id || orderId}\n`;
    text += `Phone: ${phone}\n`;
    text += `Address: ${street}, Bldg ${building}`;
    if (apartment) text += `, Apt ${apartment}`;
    if (floor) text += `, Fl ${floor}`;
    text += `\n`;
    if (comments) text += `Comment: ${comments}\n`;
    text += `Items:\n`;
    
    cart.forEach((item: any) => {
      text += `- ${item.quantity}x ${item.name} (${item.price}GEL)\n`;
    });
    
    text += `Total: ${total} GEL`;

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
          console.error(`SMS Office Error for ${targetNum}:`, await response.text());
        }
      } catch (smsErr) {
        console.error(`Failed to send SMS to ${targetNum}:`, smsErr);
      }
    }));

    // Return the real database order ID back to the client so the user sees "Order #581 placed!"
    return NextResponse.json({ success: true, orderId: insertedOrder.id || orderId });
  } catch (error) {
    console.error("Checkout API Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
