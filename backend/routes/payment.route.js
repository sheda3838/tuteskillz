// backend/routes/payment.js
import { Router } from "express";
import db from "../config/db.js"; // your existing db connection
import dotenv from "dotenv";
import CryptoJS from "crypto-js";

dotenv.config();

const router = Router();

function generateJitsiLink(sessionId) {
  const timestamp = Date.now(); // ensures uniqueness
  const roomName = `session_${sessionId}_${timestamp}`;
  return `https://meet.jit.si/${roomName}`;
}

// PayHere webhook
router.post("/payhere/webhook", (req, resp) => {
  const data = req.body;

  const {
    merchant_id,
    order_id,
    status_code,
    payhere_amount,
    currency,
    method,
    transaction_id,
  } = data;

  // Use correct App ID
  if (merchant_id !== process.env.PAYHERE_MERCHANT_ID) {
    return resp.status(400).send("Invalid Merchant ID");
  }

  // Determine payment status
  let paymentStatus;
  if (status_code === "2") paymentStatus = "Paid";
  else if (status_code === "0") paymentStatus = "Failed";
  else paymentStatus = "Failed";

  // Insert into payment table
  const insertSql = `
    INSERT INTO payment 
      (sessionId, amount, currency, paymentStatus, paymentMethod, provider, transactionId)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertSql,
    [
      order_id,
      payhere_amount,
      currency,
      paymentStatus,
      method,
      "PayHere",
      transaction_id,
    ],
    (err, result) => {
      if (err) {
        console.error("Payment insert error:", err);
        return resp.status(500).send("Server Error");
      }

      // Update session status if Paid
      if (paymentStatus === "Paid") {
        const meetingUrl = generateJitsiLink(order_id); // generate link

        const updateSql = `UPDATE session SET sessionStatus = 'Paid', meetingUrl = ? WHERE sessionId = ?`;
        db.query(updateSql, [meetingUrl, order_id], (err2) => {
          if (err2) {
            console.error("Session update error:", err2);
            return resp.status(500).send("Server Error");
          }
          console.log(
            "Payment successful, meeting link generated:",
            meetingUrl
          );
          resp.status(200).send("OK");
        });
      } else {
        resp.status(200).send("OK");
      }
    }
  );
});

router.post("/payhere/create", (req, res) => {
  const { student, sessionId } = req.body;

  const merchantId = process.env.PAYHERE_MERCHANT_ID;
  const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

  if (!merchantId || !merchantSecret) {
    console.error("PayHere credentials missing in .env");
    return res.status(500).json({ error: "Server configuration error" });
  }

  const amount = "1000.00";
  const currency = "LKR";

  const hashedSecret = CryptoJS.MD5(merchantSecret).toString().toUpperCase();
  const raw = merchantId + String(sessionId) + amount + currency + hashedSecret;

  const hash = CryptoJS.MD5(raw).toString().toUpperCase();

  const paymentData = {
    merchant_id: merchantId,
    return_url: `http://localhost:5173/session/${sessionId}`,
    cancel_url: `http://localhost:5173/session/${sessionId}`,
    notify_url:
      "https://chokingly-dandiacal-kiesha.ngrok-free.dev/api/payment/payhere/webhook",
    order_id: String(sessionId),
    items: "TuteSkillz Session Fee",
    amount,
    currency,
    first_name: student.fullName.split(" ")[0],
    last_name: student.fullName.split(" ").slice(1).join(" "),
    email: student.email,
    phone: student.phone,
    address: student.street,
    city: student.city,
    country: "Sri Lanka",
    hash,
  };

  res.json({ paymentData });
});

export default router;