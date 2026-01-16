import { useState, useEffect } from "react";
import axios from "axios";

import MediumSelector from "../../components/BrowseTutors/MediumSelector";
import GradeSelector from "../../components/BrowseTutors/GradeSelector";
import SubjectSelector from "../../components/BrowseTutors/SubjectSelector";
import TutorList from "../../components/BrowseTutors/TutorList";

import "../../styles/BrowseTutors/BrowseTutors.css";
import Header from "../../components/Home/Header";
import Footer from "../../components/Home/Footer";

import Loading from "../../utils/Loading"

import { motion, AnimatePresence } from "framer-motion";

const BrowseTutors = () => {
  axios.defaults.withCredentials = true;
  const [mediums, setMediums] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [tutors, setTutors] = useState([]);

  const [selectedMedium, setSelectedMedium] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [currentStep, setCurrentStep] = useState(1);

  const [loadingTutors, setLoadingTutors] = useState(false);

  // Page animation
  const pageVariants = {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 40 },
  };

  // Step animation
  const stepVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.98 },
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/student/tutors/mediums`)
      .then((res) => res.data.success && setMediums(res.data.data));
  }, []);

  useEffect(() => {
    if (!selectedMedium) return;
    setSelectedGrade("");
    setSelectedSubject("");
    setSubjects([]);
    setTutors([]);

    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/student/tutors/grades?medium=${selectedMedium}`
      )
      .then((res) => res.data.success && setGrades(res.data.data));
  }, [selectedMedium]);

  useEffect(() => {
    if (!selectedMedium || !selectedGrade) return;
    setSelectedSubject("");
    setTutors([]);

    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/student/tutors/subjects?medium=${selectedMedium}&grade=${selectedGrade}`
      )
      .then((res) => res.data.success && setSubjects(res.data.data));
  }, [selectedGrade]);

  useEffect(() => {
    if (!selectedMedium || !selectedGrade || !selectedSubject) return;

    setLoadingTutors(true); // start loading
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/student/tutors?medium=${selectedMedium}&grade=${selectedGrade}&subjectId=${selectedSubject}`
      )
      .then((res) => {
        if (res.data.success) setTutors(res.data.data);
        else setTutors([]);
      })
      .catch(() => setTutors([]))
      .finally(() => setLoadingTutors(false)); // stop loading
  }, [selectedSubject]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <Header />

      <div className="browse-tutors-page">
        <h1 className="browse-title">Browse Tutors</h1>

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              className="step-wrapper selector-container"
              key="step1"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <MediumSelector
                mediums={mediums}
                selected={selectedMedium}
                onSelect={(val) => {
                  setSelectedMedium(val);
                  setCurrentStep(2);
                }}
              />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              className="step-wrapper selector-container"
              key="step2"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <button className="back-btn" onClick={() => setCurrentStep(1)}>
                Back
              </button>

              <GradeSelector
                grades={grades}
                selected={selectedGrade}
                onSelect={(val) => {
                  setSelectedGrade(val);
                  setCurrentStep(3);
                }}
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              className="step-wrapper selector-container"
              key="step3"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <button className="back-btn" onClick={() => setCurrentStep(2)}>
                Back
              </button>

              <SubjectSelector
                subjects={subjects}
                selected={selectedSubject}
                onSelect={(val) => {
                  setSelectedSubject(val);
                  setCurrentStep(4);
                }}
              />
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div
              className="step-wrapper"
              key="step4"
              variants={stepVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
            >
              <button className="back-btn" onClick={() => setCurrentStep(3)}>
                Back
              </button>

              {loadingTutors ? (
                <Loading />
              ) : tutors.length > 0 ? (
                <TutorList tutors={tutors} />
              ) : (
                <p className="no-tutors-msg">No tutors found</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </motion.div>
  );
};

export default BrowseTutors;
