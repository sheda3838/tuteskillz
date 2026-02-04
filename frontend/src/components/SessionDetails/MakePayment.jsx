import React, { useState } from "react";
import "../../styles/SessionDetails/MakePayment.css";
import { notifyError, notifySuccess } from "../../utils/toast";

function MakePayment({ student, sessionId }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/payment/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student, sessionId }),
        },
      );

      const data = await res.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error("Stripe Error:", data);
        notifyError("Failed to initiate Stripe payment.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      notifyError("Payment setup error. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="make-payment">
      <button
        className="btn-make-payment"
        onClick={handlePayment}
        disabled={loading}
        style={{
          backgroundColor: "#6772e5",
          color: "white",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Processing..." : "Pay with Stripe"}
      </button>
    </div>
  );
}

export default MakePayment;
