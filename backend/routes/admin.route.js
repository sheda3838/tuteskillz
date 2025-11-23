import { Router } from "express";
import db from "../config/db.js";
import { sendEmail } from "../utils/email.js";
import { generateEmailHTML } from "../utils/emailtemplate.js";

const adminRouter = Router();

// Get all tutors
adminRouter.get("/allTutors", (req, resp) => {
  const query = `
    SELECT 
      u.userId, 
      u.fullName,
      u.email,
      u.profilePhoto,
      v.verificationId,
      v.status AS verificationStatus,
      v.type AS verificationType
    FROM users u
    JOIN tutor t
     on u.userId = t.userId
    LEFT JOIN verification v 
      ON t.verificationId = v.verificationId 
      AND v.type = 'tutor'
    WHERE u.role = 'tutor'
    ORDER BY u.userId ASC
  `;

  db.query(query, (err, tutorRows) => {
    if (err)
      return resp.status(500).json({ success: false, message: err.message });
    return resp.status(200).json({ success: true, tutors: tutorRows || [] });
  });
});

// Get all students
adminRouter.get("/allStudents", (req, resp) => {
  const query = `
    SELECT 
      u.userId,
      u.fullName,
      u.email,
      u.profilePhoto,
      g.fullName AS guardianName
    FROM users u
    JOIN student s ON u.userId = s.userId
    JOIN guardian g ON s.guardianId = g.guardianId
    WHERE u.role = 'student'
    ORDER BY u.userId ASC
  `;

  db.query(query, (err, studentRows) => {
    if (err) {
      return resp.status(500).json({ success: false, message: err.message });
    }

    return resp.status(200).json({ success: true, students: studentRows || [] });
  });
});

// Get all sessions (basic info)
adminRouter.get("/allSessions", (req, resp) => {
  const query = `
    SELECT 
      s.sessionId,
      s.date,
      s.sessionStatus,
      -- Get tutor name
      tu.fullName AS tutorName,
      -- Get student name
      su.fullName AS studentName
    FROM session s
    JOIN tutorSubject ts ON s.tutorSubjectId = ts.tutorSubjectId
    JOIN tutor t ON ts.tutorId = t.userId
    JOIN users tu ON t.userId = tu.userId
    JOIN student st ON s.studentId = st.userId
    JOIN users su ON st.userId = su.userId
    ORDER BY s.date DESC, s.startTime DESC
  `;

  db.query(query, (err, sessionRows) => {
    if (err) {
      return resp.status(500).json({ success: false, message: err.message });
    }

    return resp.status(200).json({ success: true, sessions: sessionRows || [] });
  });
});

// Get all admins (basic info)
adminRouter.get("/allAdmins", (req, resp) => {
  const query = `
    SELECT 
      u.userId,
      u.fullName,
      u.email,
      u.phone,
      u.profilePhoto
    FROM users u
    JOIN admin a ON u.userId = a.userId
    ORDER BY u.userId ASC
  `;

  db.query(query, (err, adminRows) => {
    if (err) {
      return resp.status(500).json({ success: false, message: err.message });
    }

    return resp.status(200).json({ success: true, admins: adminRows || [] });
  });
});

// routes/adminRoutes.js (or wherever you keep your admin routes)
adminRouter.get("/allNotes", (req, resp) => {
  const query = `
    SELECT 
      n.noteId AS notesId,
      n.sessionId,
      s.date AS sessionDate,
      s.sessionStatus AS status,
      tU.fullName AS tutorName
    FROM notes n
    LEFT JOIN session s ON n.sessionId = s.sessionId
    LEFT JOIN tutor t ON s.tutorSubjectId = t.userId
    LEFT JOIN users tU ON t.userId = tU.userId
    ORDER BY n.noteId ASC
  `;

  db.query(query, (err, rows) => {
    if (err)
      return resp.status(500).json({ success: false, message: err.message });

    return resp.status(200).json({ success: true, notes: rows || [] });
  });
});


// Get counts for dashboard
adminRouter.get("/counts", (req, resp) => {
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM users WHERE role = 'tutor') AS tutorCount,
      (SELECT COUNT(*) FROM users WHERE role = 'student') AS studentCount,
      (SELECT COUNT(*) FROM users WHERE role = 'admin') AS adminCount,
      (SELECT COUNT(*) FROM session WHERE sessionStatus = 'completed') AS sessionCount,
      (SELECT COUNT(*) FROM notes) AS notesCount
  `;

  db.query(query, (err, rows) => {
    if (err) {
      return resp.status(500).json({ success: false, message: err.message });
    }

    // rows[0] will have all counts
    return resp.status(200).json({ success: true, counts: rows[0] });
  });
});


// Extract subjects table from tutor transcripts
adminRouter.post("/tutor/parse-text", async (req, resp) => {
  const { transcriptText } = req.body;

  if (!transcriptText) {
    return resp
      .status(400)
      .json({ success: false, message: "No transcript text provided" });
  }

  const lines = transcriptText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && l !== "SUBJECT GRADE DEFINITION");

  const results = lines
    .map((line) => {
      const match = line.match(/^(.+?)\s+([A-CFSW])\s+(.+)$/i);

      if (match) {
        return {
          subject: match[1].trim(),
          grade: match[2].trim(),
        };
      }
      return null;
    })
    .filter(Boolean);

  return resp.json({ success: true, results });
});

adminRouter.post("/tutor/save-results/:tutorId/:examType", (req, res) => {
  const { tutorId, examType } = req.params;
  const { results } = req.body;

  if (!results || !Array.isArray(results) || results.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No results provided" });
  }

  if (!["OL", "AL"].includes(examType)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid exam type" });
  }

  db.beginTransaction((err) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });

    // Delete old results
    db.query(
      "DELETE FROM examResults WHERE tutorId = ? AND examType = ?",
      [tutorId, examType],
      (err) => {
        if (err)
          return db.rollback(() =>
            res.status(500).json({ success: false, message: err.message })
          );

        const insertNext = (index) => {
          if (index >= results.length) {
            return db.commit((err) => {
              if (err)
                return db.rollback(() =>
                  res.status(500).json({ success: false, message: err.message })
                );
              return res.json({
                success: true,
                message: `${examType} results saved successfully`,
              });
            });
          }

          const { subject, grade } = results[index];
          const subjectName = subject.trim().toUpperCase();
          const examGrade = grade.trim().toUpperCase();

          // Check subject exists
          db.query(
            "SELECT subjectId FROM subject WHERE subjectName = ?",
            [subjectName],
            (err, rows) => {
              if (err)
                return db.rollback(() =>
                  res.status(500).json({ success: false, message: err.message })
                );

              const insertExamResult = (subjectId) => {
                db.query(
                  "INSERT INTO examResults (examType, grade, tutorId, subjectId) VALUES (?,?,?,?)",
                  [examType, examGrade, tutorId, subjectId],
                  (err) => {
                    if (err)
                      return db.rollback(() =>
                        res
                          .status(500)
                          .json({ success: false, message: err.message })
                      );
                    insertNext(index + 1);
                  }
                );
              };

              if (rows.length > 0) {
                insertExamResult(rows[0].subjectId);
              } else {
                db.query(
                  "INSERT INTO subject (subjectName) VALUES (?)",
                  [subjectName],
                  (err, result) => {
                    if (err)
                      return db.rollback(() =>
                        res
                          .status(500)
                          .json({ success: false, message: err.message })
                      );
                    insertExamResult(result.insertId);
                  }
                );
              }
            }
          );
        };

        insertNext(0); // start recursion
      }
    );
  });
});

adminRouter.post("/tutor/approve/:tutorId", (req, res) => {
  const { tutorId } = req.params;
  const { adminId, verifiedNotes } = req.body;

  if (!adminId)
    return res
      .status(400)
      .json({ success: false, message: "Admin ID required" });

  db.beginTransaction((err) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });

    db.query(
      "INSERT INTO verification (verifiedByAdminId, status, type, verifiedNotes) VALUES (?,?,?,?)",
      [adminId, "Approved", "tutor", verifiedNotes || ""],
      (err, verResult) => {
        if (err)
          return db.rollback(() =>
            res.status(500).json({ success: false, message: err.message })
          );

        const verificationId = verResult.insertId;

        db.query(
          "UPDATE tutor SET verificationId = ? WHERE userId = ?",
          [verificationId, tutorId],
          async (err) => {
            if (err)
              return db.rollback(() =>
                res.status(500).json({ success: false, message: err.message })
              );

            db.commit(async (err) => {
              if (err)
                return db.rollback(() =>
                  res.status(500).json({ success: false, message: err.message })
                );

              // ✅ Fetch tutor email
              try {
                const [rows] = await db
                  .promise()
                  .query("SELECT email, fullName FROM users WHERE userId = ?", [
                    tutorId,
                  ]);
                const tutorEmail = rows[0]?.email;
                const tutorName = rows[0]?.fullName || "Tutor";

                if (tutorEmail) {
                  const emailHtml = generateEmailHTML({
                    title: `Congratulations, ${tutorName}!`,
                    message:
                      "Your tutor application has been approved by our admin.",
                    buttonText: "Go to Login",
                    buttonUrl: `${process.env.FRONTEND_URL}signin`,
                    additionalNotes: verifiedNotes
                      ? `Notes from admin: ${verifiedNotes}`
                      : "",
                  });
                  await sendEmail(
                    tutorEmail,
                    "Tutor Application Approved",
                    emailHtml
                  );
                }
              } catch (emailErr) {
                console.error("Error sending approval email:", emailErr);
              }

              return res.json({
                success: true,
                message: "Tutor approved successfully",
                verificationId,
              });
            });
          }
        );
      }
    );
  });
});

// adminRouter.js

// Reject Tutor Route
adminRouter.post("/reject-tutor/:tutorId", (req, res) => {
  const { tutorId } = req.params;
  const { note, adminId } = req.body;

  if (!adminId)
    return res
      .status(400)
      .json({ success: false, message: "Admin ID required" });

  db.beginTransaction((err) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });

    // Insert verification record as Rejected
    db.query(
      "INSERT INTO verification (verifiedByAdminId, status, type, verifiedNotes) VALUES (?,?,?,?)",
      [adminId, "Rejected", "tutor", note || ""],
      (err, verResult) => {
        if (err)
          return db.rollback(() =>
            res.status(500).json({ success: false, message: err.message })
          );

        const verificationId = verResult.insertId;

        // Update tutor with verificationId
        db.query(
          "UPDATE tutor SET verificationId = ? WHERE userId = ?",
          [verificationId, tutorId],
          (err) => {
            if (err)
              return db.rollback(() =>
                res.status(500).json({ success: false, message: err.message })
              );

            db.commit((err) => {
              if (err)
                return db.rollback(() =>
                  res.status(500).json({ success: false, message: err.message })
                );

              // Fetch tutor email and send rejection email
              db.query(
                "SELECT email FROM users WHERE userId = ?",
                [tutorId],
                (err, rows) => {
                  if (!err && rows.length > 0) {
                    const tutorEmail = rows[0].email;
                    const emailHtml = generateEmailHTML({
                      title: "Tutor Application Rejected",
                      message:
                        "Unfortunately, your application has been rejected.",
                      additionalNotes: note || "",
                    });

                    sendEmail(
                      tutorEmail,
                      "Tutor Application Rejected",
                      emailHtml
                    );
                  }
                  // Return response regardless of email success/failure
                  return res.json({
                    success: true,
                    message: "Tutor rejected successfully",
                    verificationId,
                  });
                }
              );
            });
          }
        );
      }
    );
  });
});

export default adminRouter;
