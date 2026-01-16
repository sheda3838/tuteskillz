import React from "react";
import "../../styles/SessionDetails/MakePayment.css";


function MakePayment({ student, sessionId }) {
const handlePayment = async () => {
try {
const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/payment/payhere/create`, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ student, sessionId }),
});


const data = await res.json();
if (!data?.paymentData) {
console.error("Invalid response:", data);
alert("Payment initialization failed. Check backend logs.");
return;
}


const form = document.createElement("form");
form.method = "POST";
form.action = "https://sandbox.payhere.lk/pay/checkout";
form.style.display = "none";


Object.entries(data.paymentData).forEach(([key, value]) => {
const input = document.createElement("input");
input.name = key;
input.value = value;
form.appendChild(input);
});


document.body.appendChild(form);
form.submit();
document.body.removeChild(form);
} catch (error) {
console.error("Payment error:", error);
alert("Payment setup error. Check console.");
}
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