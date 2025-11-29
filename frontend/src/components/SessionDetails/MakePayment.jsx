// src/components/SessionDetails/MakePayment.jsx
import React from "react";
import "../../styles/SessionDetails/MakePayment.css";

function MakePayment({ student, sessionId }) {
  const handlePayment = async () => {
    // call backend to get checkout form or redirect URL
    const res = await fetch(`https://chokingly-dandiacal-kiesha.ngrok-free.dev/api/payment/payhere/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student, sessionId }),
    });
    const data = await res.json();

    // backend returns a small HTML form to auto-submit
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://sandbox.payhere.lk/pay/checkout";
    form.style.display = "none";

    Object.keys(data.paymentData).forEach((key) => {
      const input = document.createElement("input");
      input.name = key;
      input.value = data.paymentData[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  return (
    <div className="make-payment">
      <button className="btn-make-payment" onClick={handlePayment}>
        Make Payment
      </button>
    </div>
  );
}

export default MakePayment;
