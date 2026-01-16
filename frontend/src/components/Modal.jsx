import React from "react";
import { AiOutlineClose } from "react-icons/ai";   // ← import close icon
import "../styles/Utils/Modal.css";

const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <AiOutlineClose size={22} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
