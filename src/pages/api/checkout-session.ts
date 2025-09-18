// src/pages/api/checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { session_id } = req.query;

  try {
    if (!session_id || typeof session_id !== "string") {
      return res.status(400).json({ error: "Falta session_id" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent.payment_method", "payment_intent.charges"],
    });

    const charge = (session.payment_intent as any).charges.data[0];
    res.status(200).json({ receipt_url: charge.receipt_url });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
