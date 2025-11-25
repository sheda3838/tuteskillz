import React, { useState, useEffect } from "react";
import axios from "axios";
import { notifySuccess, notifyError } from "../../utils/toast";
import banksData from "../../../data/banks.json";
import "../../styles/TutorProfile/SetBankDetails.css";

const SetBankDetails = ({ tutorId, onClose, onSaved }) => {
  axios.defaults.withCredentials = true;
  const [accounts, setAccounts] = useState([
    {
      bankName: "",
      branch: "",
      accountNumber: "",
      beneficiaryName: "",
      isPrimary: false,
    },
  ]);

  // Update a field in a specific account row
  const updateAccount = (index, field, value) => {
    const updated = [...accounts];
    updated[index][field] = field === "isPrimary" ? value : value.trim();
    setAccounts(updated);
  };

  // Add new account row
  const addAccount = () => {
    // Validate previous rows before adding
    for (let i = 0; i < accounts.length; i++) {
      const acc = accounts[i];
      if (
        !acc.bankName ||
        !acc.branch ||
        !acc.accountNumber ||
        !acc.beneficiaryName
      ) {
        notifyError(
          `Please complete row ${i + 1} before adding a new account.`
        );
        return;
      }
    }
    setAccounts([
      ...accounts,
      {
        bankName: "",
        branch: "",
        accountNumber: "",
        beneficiaryName: "",
        isPrimary: false,
      },
    ]);
  };

  // Remove account row
  const removeAccount = (index) => {
    const updated = [...accounts];
    updated.splice(index, 1);
    setAccounts(updated);
  };

  // Validation before submitting
  const validateAccounts = () => {
  let hasError = false;

  if (accounts.length === 0) {
    notifyError("Add at least one bank account.");
    return false;
  }

  let primaryCount = 0;

  accounts.forEach((acc, idx) => {
    // 1️⃣ Required fields
    if (
      !acc.bankName ||
      !acc.branch ||
      !acc.accountNumber ||
      !acc.beneficiaryName
    ) {
      notifyError(`Row ${idx + 1}: All fields are required.`);
      hasError = true;
    }

    // 2️⃣ Account number must be digits only
    if (!/^\d+$/.test(acc.accountNumber)) {
      notifyError(`Row ${idx + 1}: Account number must contain digits only.`);
      hasError = true;
    }

    // 3️⃣ Minimum length 5 digits
    if (acc.accountNumber.length < 5) {
      notifyError(`Row ${idx + 1}: Account number must be at least 5 digits.`);
      hasError = true;
    }

    if (acc.isPrimary) primaryCount++;
  });

  if (primaryCount === 0) {
    notifyError("Please mark one account as primary.");
    hasError = true;
  }
  if (primaryCount > 1) {
    notifyError("Only one account can be marked as primary.");
    hasError = true;
  }

  return !hasError;
};


  // Submit to backend
  const handleSubmit = async () => {
    if (!validateAccounts()) return;

    try {
      const payload = {
        tutorId,
        accounts,
      };

      console.log(payload);
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/tutor/bank-details`, payload);
      if (data.success) {
        notifySuccess("Bank details saved successfully!");
        onSaved();
      } else {
        notifyError(data.message || "Failed to save bank details.");
      }
    } catch (err) {
      console.error(err);
      notifyError("Server error. Try again later.");
    }
  };

  const handleCancel = () => {
    // Check if at least one complete account exists
    const hasCompleteAccount = accounts.some(
      (acc) =>
        acc.bankName && acc.branch && acc.accountNumber && acc.beneficiaryName
    );

    // Check if any partially filled row exists
    const hasPartial = accounts.some((acc) => {
      const fields = [
        acc.bankName,
        acc.branch,
        acc.accountNumber,
        acc.beneficiaryName,
      ];
      const filledCount = fields.filter((f) => f && f.trim() !== "").length;
      return filledCount > 0 && filledCount < fields.length;
    });

    if (hasPartial) {
      notifyError(
        "You have partially filled account details. Complete or remove them before closing."
      );
      return;
    }

    if (!hasCompleteAccount) {
      notifyError(
        "You must add at least one complete bank account before closing."
      );
      return;
    }

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal form-modal">
        <h2>Set Bank Details</h2>

        <form>
          {accounts.map((acc, idx) => (
            <div key={idx} className="bank-row grid-2">
              <div className="form-group">
                <select
                  value={acc.bankName}
                  onChange={(e) =>
                    updateAccount(idx, "bankName", e.target.value)
                  }
                >
                  <option value="">Select Bank</option>
                  {banksData.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
                <label>Bank</label>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Branch"
                  value={acc.branch}
                  onChange={(e) => updateAccount(idx, "branch", e.target.value)}
                />
                <label>Branch</label>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Account Number"
                  value={acc.accountNumber}
                  onChange={(e) =>
                    updateAccount(idx, "accountNumber", e.target.value)
                  }
                />
                <label>Account Number</label>
              </div>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Beneficiary Name"
                  value={acc.beneficiaryName}
                  onChange={(e) =>
                    updateAccount(idx, "beneficiaryName", e.target.value)
                  }
                />
                <label>Beneficiary Name</label>
              </div>

              <button
                type="button"
                onClick={() => updateAccount(idx, "isPrimary", !acc.isPrimary)}
                className={`primary-btn ${acc.isPrimary ? "active" : ""}`}
              >
                {acc.isPrimary ? "Primary" : "Set Primary"}
              </button>

              {accounts.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAccount(idx)}
                  className="remove-btn"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={addAccount} className="addBtn">
            + Add Another Account
          </button>

          <div className="actions">
            <button type="button" onClick={handleSubmit} className="submit-btn">
              Save
            </button>
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetBankDetails;
