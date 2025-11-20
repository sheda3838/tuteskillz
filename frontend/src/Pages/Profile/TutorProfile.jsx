import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/TutorProfile/TutorProfile.css";

import ProfileHeader from "../../components/TutorProfile/ProfileHeader";
import PersonalInfoCard from "../../components/TutorProfile/PersonalInfoCard";
import AddressCard from "../../components/TutorProfile/AddressCard";
import SchoolUniversityCard from "../../components/TutorProfile/SchoolUniversityCard";
import ExamResultsCard from "../../components/TutorProfile/ExamResultsCard";
import RatingsCard from "../../components/TutorProfile/RatingsCard";
import TeachingSubjectsTable from "../../components/TutorProfile/TeachingSubjectsTable";
import DownloadTranscripts from "../../components/TutorProfile/DownloadTranscripts";
import AdminVerificationControls from "../../components/TutorProfile/AdminVerificationControls";
import VerifiedByAdmin from "../../components/TutorProfile/VerifiedByAdmin";
import ActionButtons from "../../components/TutorProfile/ActionButtons";
import AvailabilityCard from "../../components/TutorProfile/AvailabilityCard";
import BankDetailsCard from "../../components/TutorProfile/BankDetailsCard";
import RequestSessionModal from "../../components/BrowseTutors/RequestSession";

import Modal from "../../components/Modal"; // your modal component
import { notifySuccess } from "../../utils/toast";
import { useLocation } from "react-router-dom";

const TutorProfile = ({ currentUserRole }) => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(null);
  const [requestSessionModalVisible, setRequestSessionModalVisible] =
    useState(false);

  const location = useLocation();
  const { tutorSubjectId } = location.state || {};

  useEffect(() => {
    axios
      .get(`/api/profile/tutor/${id}`)
      .then((res) => {
        setProfile(res.data.profile);
        setLoading(false);
      })
      .catch((err) => {
        notifyError(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>Tutor not found</p>;

  const isAdmin = currentUserRole === "admin";
  const isTutor = currentUserRole === "tutor";
  const isStudent = currentUserRole === "student";
  const isPending = isAdmin && profile.verification.status === "Pending";
  const isVerified = isAdmin && profile.verification.status === "Approved";

  return (
    <>
      <div className="tutor-profile-page">
        {/* Header */}
        <div className="section header-section">
          <ProfileHeader profile={profile} currentUserRole={currentUserRole} />
        </div>

        {/* Personal + Address */}
        {(isTutor || isPending || isVerified) && (
          <div className="section two-col">
            <PersonalInfoCard profile={profile} />
            <AddressCard profile={profile} />
          </div>
        )}

        {/* Education */}
        <div className="section">
          <SchoolUniversityCard profile={profile} />
        </div>

        {/* Results OR transcripts */}
        <div className="section">
          {isPending ? (
            <DownloadTranscripts profile={profile} />
          ) : (
            <ExamResultsCard profile={profile} />
          )}
        </div>

        {/* Ratings */}
        {(isTutor || isVerified) && (
          <div className="section">
            <RatingsCard profile={profile} />
          </div>
        )}

        {/* Admin Verify/Reject */}
        {isPending && (
          <div className="section">
            <AdminVerificationControls
              onVerify={() => navigate(`/tutor-verification/${profile.userId}`)}
              onRejectSubmit={(note) => {
                const admin = JSON.parse(localStorage.getItem("admin"));
                if (!admin?.userId) return notifyError("Admin info missing");

                axios
                  .post(`/api/admin/reject-tutor/${profile.userId}`, {
                    note,
                    adminId: admin.userId, // 🔥 include this
                  })
                  .then(() => notifySuccess("Tutor rejected"))
                  .catch((err) =>
                    notifyError(
                      "Error rejecting tutor: " +
                        (err.response?.data?.message || err.message)
                    )
                  );
              }}
              profile={profile}
            />
          </div>
        )}

        {isVerified && (
          <div className="section">
            <VerifiedByAdmin profile={profile} />
          </div>
        )}

        {/* Action Buttons */}
        <div className="section">
          <ActionButtons
            role={currentUserRole}
            onSubjects={() => setOpenModal("subjects")}
            onAvailability={() => setOpenModal("availability")}
            onBankDetails={() => setOpenModal("bank")}
            onRequestSession={() => setRequestSessionModalVisible(true)}
          />
        </div>
      </div>

      {/* =======================
          MODALS
      ========================= */}
      {openModal === "subjects" && (
        <Modal onClose={() => setOpenModal(null)}>
          <TeachingSubjectsTable profile={profile} />
        </Modal>
      )}

      {openModal === "availability" && (
        <Modal onClose={() => setOpenModal(null)}>
          <AvailabilityCard profile={profile} />
        </Modal>
      )}

      {openModal === "bank" && (
        <Modal onClose={() => setOpenModal(null)}>
          <BankDetailsCard profile={profile} />
        </Modal>
      )}

      {/* 🔥 Request Session Modal */}
      {requestSessionModalVisible && tutorSubjectId && (
        <RequestSessionModal
          visible={requestSessionModalVisible}
          onClose={() => setRequestSessionModalVisible(false)}
          tutorSubjectId={tutorSubjectId}
        />
      )}
    </>
  );
};

export default TutorProfile;
