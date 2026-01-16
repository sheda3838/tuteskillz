import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { notifyError, notifySuccess } from "../../utils/toast";
import "../../styles/User/register.css";
import { Plus, XCircle, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FileHelper } from "../../utils/fileHelper";
import universityData from "../../../data/universities.json";
import { useLocation } from "react-router-dom";
import Loading from "../../utils/Loading";

/* ---------- Step 1 ---------- */
const Step1 = ({ formData, handleChange, role }) => {
  const isTutor = role === "tutor";
  const grades = [6, 7, 8, 9];
  const universities = universityData.map((u) => u.name);

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="form-step"
    >
      <h2 className="step-header">
        {isTutor
          ? "Let's know more about you, the inspiring tutor!"
          : "Let's get to know the bright mind behind the screen"}
      </h2>

      <div className="form-grid">
        {/* Common Fields */}
        <Input
          name="fullName"
          label="Full Name"
          value={formData.fullName}
          onChange={handleChange}
        />
        <Input
          type="date"
          name="dob"
          label="Date of Birth"
          value={formData.dob}
          onChange={handleChange}
        />
        <Input
          type="tel"
          name="phone"
          label="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />

        <div className="radio-group-container">
          <p className="radio-label">Gender:</p>
          <div className="radio-options">
            {[
              { label: "Male", value: "M" },
              { label: "Female", value: "F" },
            ].map((g) => (
              <label key={g.value} className="radio-option">
                <input
                  type="radio"
                  name="gender"
                  value={g.value}
                  checked={formData.gender === g.value}
                  onChange={handleChange}
                />
                {g.label}
              </label>
            ))}
          </div>
        </div>

        {/* Student Fields */}
        {!isTutor && (
          <>
            <Select
              name="grade"
              label="Grade"
              value={formData.grade}
              options={grades.map((g) => g)}
              onChange={handleChange}
            />
            <Input
              name="gFullName"
              label="Guardian Full Name"
              value={formData.gFullName}
              onChange={handleChange}
            />
            <Input
              type="email"
              name="gEmail"
              label="Guardian Email"
              value={formData.gEmail}
              onChange={handleChange}
            />
            <Input
              type="tel"
              name="gPhone"
              label="Guardian Phone"
              value={formData.gPhone}
              onChange={handleChange}
            />
          </>
        )}

        {/* Tutor Fields */}
        {isTutor && (
          <>
            <Input
              type="text"
              name="school"
              label="School"
              value={formData.school}
              onChange={handleChange}
            />

            <Select
              name="university"
              label=""
              value={formData.university}
              options={universities}
              onChange={handleChange}
            />

            <FileInput
              id="olTranscript"
              label="Upload your OL Transcript"
              file={formData.olTranscript}
              accept="application/pdf"
              onChange={handleChange}
            />
            <FileInput
              id="alTranscript"
              label="Upload your AL Transcript"
              file={formData.alTranscript}
              accept="application/pdf"
              onChange={handleChange}
            />

            <div className="form-group full-width bio-group">
              <textarea
                name="bio"
                className="input-bio"
                placeholder=" "
                value={formData.bio}
                onChange={handleChange}
                required
              />
              <label htmlFor="bio" className="label-bio">
                Bio
              </label>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

/* ---------- Step 2 ---------- */
const Step2 = ({ formData, handleChange }) => {
  const provinces = [
    "Central",
    "Eastern",
    "North Central",
    "Northern",
    "North Western",
    "Sabaragamuwa",
    "Southern",
    "Uva",
    "Western",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="form-step"
    >
      <h2 className="step-header">
        Let's map your path - we just need your location
      </h2>
      <div className="form-grid">
        <Input
          name="street"
          label="Street Address"
          value={formData.street}
          onChange={handleChange}
        />
        <Input
          name="city"
          label="City"
          value={formData.city}
          onChange={handleChange}
        />
        <Select
          name="province"
          label=""
          value={formData.province}
          options={provinces}
          onChange={handleChange}
        />
        <Input
          name="postalCode"
          label="Postal Code"
          value={formData.postalCode}
          onChange={handleChange}
        />
      </div>
    </motion.div>
  );
};

/* ---------- Step 3 ---------- */
const Step3 = ({ formData, handleChange, role }) => {
  const isTutor = role === "tutor";
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="form-step step-3"
    >
      <h2 className="step-header">
        Your journey starts with a click - ready to shine?
      </h2>

      <div className="form-grid single-column">
        <div
          className="form-group file-upload-group"
          onClick={() => document.getElementById("profilePic").click()}
        >
          {formData.profilePic ? (
            <img
              src={URL.createObjectURL(formData.profilePic)}
              alt="Profile Preview"
              className="profile-preview"
            />
          ) : (
            <p className="file-label">
              {isTutor
                ? "Click here to upload Profile Picture (Mandatory)"
                : "Click here to upload Profile Picture (Optional)"}
            </p>
          )}
          <input
            type="file"
            name="profilePic"
            id="profilePic"
            accept="image/*"
            onChange={handleChange}
            className="hidden-file-input"
          />
        </div>
        <p className="upload-note">
          Your photo will be used for official identification purposes only.
        </p>
      </div>
    </motion.div>
  );
};

/* ---------- Step 4 (Tutor Subjects) ---------- */
const Step4_TutorSubjects = ({
  teachingSubjects,
  onChangeSet,
  onAddSet,
  onRemoveSet,
  subjects,
}) => {
  const mediums = ["English", "Sinhala", "Tamil"];
  const grades = ["6", "7", "8", "9"];

  // --- Helper for duplicate detection ---
  const isDuplicate = (arr) => {
    const seen = new Set();
    for (const s of arr) {
      const key = `${s.medium}-${s.grade}-${s.subjectId}`;
      if (seen.has(key)) return true;
      seen.add(key);
    }
    return false;
  };

  const handleAdd = () => {
    const last = teachingSubjects[teachingSubjects.length - 1];

    // (1) Validate previous set filled before adding new
    if (!last.medium || !last.grade || !last.subjectId) {
      notifyError(
        "Please complete the current teaching set before adding another."
      );
      return;
    }

    // (3) Check for duplicate before adding
    if (isDuplicate(teachingSubjects)) {
      notifyError("Duplicate teaching combinations are not allowed.");
      return;
    }

    onAddSet(); // safe to add new empty set
  };

  const handleRemove = (idx) => {
    onRemoveSet(idx);
    // (2) If all sets removed, restore one empty set
    setTimeout(() => {
      if (teachingSubjects.length === 1) {
        onAddSet();
      }
    }, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="form-step"
    >
      <h2 className="step-header">What do you teach?</h2>

      {teachingSubjects.map((set, idx) => (
        <div key={idx} className="teaching-set-row">
          <Select
            name={`medium-${idx}`}
            value={set.medium}
            onChange={(e) => onChangeSet(idx, "medium", e.target.value)}
            options={mediums}
            label="Medium"
          />

          <Select
            name={`grade-${idx}`}
            value={set.grade}
            onChange={(e) => onChangeSet(idx, "grade", e.target.value)}
            options={grades}
            label="Grade"
          />

          <Select
            name={`subject-${idx}`}
            value={
              subjects.find((s) => s.subjectId === set.subjectId)
                ?.subjectName || ""
            }
            onChange={(e) => {
              const selected = subjects.find(
                (s) => s.subjectName === e.target.value
              );
              onChangeSet(idx, "subjectId", selected ? selected.subjectId : "");
            }}
            options={subjects.map((s) => s.subjectName)}
            label="Subject"
          />

          <button
            type="button"
            className="btn-remove-set"
            onClick={() => handleRemove(idx)}
          >
            <XCircle size={20} />
          </button>
        </div>
      ))}

      <button type="button" className="btn-add-set" onClick={handleAdd}>
        <Plus size={18} /> Add another set
      </button>
    </motion.div>
  );
};

/* ---------- Main Component ---------- */
const Register = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const role = location.state?.role;

  const [step, setStep] = useState(1);
  const [subjects, setSubjects] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedEmail = storedUser?.email || "";

  useEffect(() => {
    if (!role) {
      notifyError("Please select a role first.");
      navigate("/role-selection", { replace: true });
    }
  }, [role, navigate]);

  const isTutor = role === "tutor";

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    phone: "",
    grade: "",
    gFullName: "",
    gEmail: "",
    gPhone: "",
    school: "",
    university: "",
    olTranscript: null,
    alTranscript: null,
    bio: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
    profilePic: null,
    teachingSubjects: [{ medium: "", grade: "", subjectId: "" }],
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/subjects`, {
        withCredentials: true,
      })
      .then((res) => {
        setSubjects(Array.isArray(res.data) ? res.data : res.data?.data || []);
      })
      .catch(() => console.log("Failed to fetch subjects"));
  }, []);

  // === File Size Limits ===
  const MAX_PROFILE_PIC_SIZE = 1 * 1024 * 1024; // 1MB
  const MAX_TRANSCRIPT_SIZE = 5 * 1024 * 1024; // 5MB

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    // ---------- FILE INPUTS ----------
    if (files && files[0]) {
      const file = files[0];

      if (name === "profilePic") {
        if (file.size > MAX_PROFILE_PIC_SIZE) {
          notifyError("Profile picture must be smaller than 1MB.");
          return;
        }
        if (!file.type.startsWith("image/")) {
          notifyError("Profile picture must be an image.");
          return;
        }
      }

      if (name === "olTranscript" || name === "alTranscript") {
        if (file.size > MAX_TRANSCRIPT_SIZE) {
          notifyError("Transcript must be smaller than 5MB.");
          return;
        }
        if (file.type !== "application/pdf") {
          notifyError("Transcript must be a PDF file.");
          return;
        }
      }

      setFormData((prev) => ({ ...prev, [name]: file }));
      return;
    }

    // ---------- RADIO BUTTONS ----------
    if (type === "radio") {
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }

    // ---------- TEXT VALIDATION ----------
    if (name === "fullName") {
      if (/\d/.test(value)) {
        notifyError("Full name cannot contain numbers.");
        return;
      }
    }

    // ---------- NORMAL INPUT UPDATE ----------
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- Step Validation ---------- */
  const validateStep = () => {
    const {
      phone,
      postalCode,
      dob,
      gPhone,
      olTranscript,
      alTranscript,
      profilePic,
      school,
      university,
      bio,
      fullName,
      gender,
      grade,
      gFullName,
      gEmail,
      street,
      city,
      province,
    } = formData;
    const age = new Date().getFullYear() - new Date(dob).getFullYear();

    // Common
    if (!/^\d{10}$/.test(phone))
      return notifyError("Phone number must be 10 digits.");
    if (step >= 2 && !/^\d{5}$/.test(postalCode))
      return notifyError("Postal code must be 5 digits.");

    if (step === 1) {
      if (!fullName || !dob || !gender)
        return notifyError("Please fill in all personal details.");
      if (isTutor) {
        if (age < 18 || age > 30)
          return notifyError("Tutor age must be between 18 and 30.");
        if (!school) return notifyError("School and University are required.");
        if (!olTranscript || !alTranscript)
          return notifyError("OL and AL transcripts are required.");
        if (
          olTranscript.type !== "application/pdf" ||
          alTranscript.type !== "application/pdf"
        )
          return notifyError("Transcripts must be PDF files.");
        if (!bio || bio.trim().length < 250) {
          return notifyError("Bio must be at least 250 characters long.");
        }
      } else {
        if (age < 9 || age > 16)
          return notifyError("Student age must be between 9 and 16.");
        if (!grade || !gFullName || !gEmail || !/^\d{10}$/.test(gPhone))
          return notifyError("Please complete guardian details correctly.");
      }
    }

    if (step === 3 && isTutor && !profilePic)
      return notifyError("Profile picture is required for tutors.");

    if (step === 4 && isTutor) {
      for (const set of formData.teachingSubjects) {
        if (!set.medium || !set.grade || !set.subjectId) {
          return notifyError(
            "Please make sure to complete all teaching sets before submitting."
          );
        }
      }
    }

    return true;
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (validateStep() === true)
      setStep((prev) => Math.min(prev + 1, isTutor ? 4 : 3));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep() !== true) return;

    setLoading(true);
    try {
      const endpoint = isTutor
        ? `${import.meta.env.VITE_BACKEND_URL}/tutor/register`
        : `${import.meta.env.VITE_BACKEND_URL}/student/register`;

      // --- Grab email from localStorage safely ---
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const storedEmail = storedUser?.email || "";

      // --- Prepare files as usual ---
      const prepared = await FileHelper.prepareFiles(formData);

      // --- Merge email into payload ---
      const payload = { ...prepared, email: storedEmail };

      const res = await axios.post(endpoint, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.success) {
        notifySuccess(
          isTutor
            ? "Registration successful! Your account is now pending admin approval."
            : res.data.message
        );

        // Store email in localStorage for LoggedinHome
        localStorage.setItem(
          "user",
          JSON.stringify({ email: storedEmail, timestamp: Date.now() })
        );

        // Navigate without state
        setTimeout(() => navigate("/loggedin-home"), 500);
      } else {
        notifyError(res.data.message);
      }
    } catch (err) {
      console.error(err);
      notifyError("Something went wrong during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="student-register-container">
          <div className="stepper-wrapper">
            <div className="stepper">
              <div
                className="step-progress-bar"
                style={{
                  width: `${((step - 1) / (isTutor ? 3 : 2)) * 100}%`,
                }}
              ></div>

              <div className={`step ${step === 1 ? "active" : ""}`}>1</div>
              <div className={`step ${step === 2 ? "active" : ""}`}>2</div>
              <div className={`step ${step === 3 ? "active" : ""}`}>3</div>

              {isTutor && (
                <div className={`step ${step === 4 ? "active" : ""}`}>4</div>
              )}
            </div>
          </div>

          <form onSubmit={step === (isTutor ? 4 : 3) ? handleSubmit : nextStep}>
            {step === 1 && (
              <Step1
                formData={formData}
                handleChange={handleChange}
                role={role}
              />
            )}
            {step === 2 && (
              <Step2 formData={formData} handleChange={handleChange} />
            )}
            {step === 3 && (
              <Step3
                formData={formData}
                handleChange={handleChange}
                role={role}
              />
            )}
            {isTutor && step === 4 && (
              <Step4_TutorSubjects
                teachingSubjects={formData.teachingSubjects}
                onChangeSet={(i, f, v) =>
                  setFormData((p) => {
                    const updated = [...p.teachingSubjects];
                    updated[i][f] = v;
                    return { ...p, teachingSubjects: updated };
                  })
                }
                onAddSet={() =>
                  setFormData((p) => ({
                    ...p,
                    teachingSubjects: [
                      ...p.teachingSubjects,
                      { medium: "", grade: "", subjectId: "" },
                    ],
                  }))
                }
                onRemoveSet={(i) =>
                  setFormData((p) => ({
                    ...p,
                    teachingSubjects: p.teachingSubjects.filter(
                      (_, idx) => idx !== i
                    ),
                  }))
                }
                subjects={subjects}
              />
            )}

            <div className="form-navigation">
              {step > 1 && (
                <button type="button" className="btn-back" onClick={prevStep}>
                  Back
                </button>
              )}
              <button type="submit" className="btn-next">
                {step === (isTutor ? 4 : 3) ? "Submit" : "Next"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

/* ---------- Helper Components ---------- */
const Input = ({ name, label, value, onChange, type = "text" }) => (
  <div className="form-group">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder=" "
      required
    />
    <label htmlFor={name}>{label}</label>
  </div>
);

const Select = ({ name, label, value, options, onChange }) => {
  const datalistId = `${name}-list`;

  return (
    <div className="form-group select-wrapper">
      <input
        list={datalistId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Select ${label}`}
      />
      <datalist id={datalistId}>
        {options.map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
      <label htmlFor={name}>{label}</label>
    </div>
  );
};

const FileInput = ({ id, label, file, onChange, accept }) => (
  <div className="form-group">
    <div
      className="file-input-mimic"
      onClick={() => document.getElementById(id).click()}
    >
      {file ? (
        <span className="transcript-upload">
          <Check size={16} /> Uploaded
        </span>
      ) : (
        <span className="placeholder">{label}</span>
      )}
    </div>

    <input
      type="file"
      id={id}
      name={id}
      accept={accept}
      onChange={onChange}
      className="hidden-file-input"
    />
  </div>
);

export default Register;
