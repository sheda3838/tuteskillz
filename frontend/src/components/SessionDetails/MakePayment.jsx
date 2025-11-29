import React from "react";
import "../../styles/SessionDetails/MakePayment.css";

function MakePayment({ onPayment }) {
  return (
    <div className="make-payment">
      <button className="btn-make-payment" onClick={onPayment}>
        Make Payment
      </button>
    </div>
  );
}

export default MakePayment;
