import { Router } from "express";
import db from "../config/db.js";

const sessionRouter = Router();

sessionRouter.post("/request", (req, res) => {
  const { tutorSubjectId, studentId, date, startTime, duration, studentNote } =
    req.body;

  if (!tutorSubjectId || !studentId || !date || !startTime || !duration) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided",
    });
  }

  const sql = `
    INSERT INTO session 
      (tutorSubjectId, studentId, date, startTime, duration, studentNote, sessionStatus)
    VALUES (?, ?, ?, ?, ?, ?, 'Requested')
  `;

  db.query(
    sql,
    [tutorSubjectId, studentId, date, startTime, duration, studentNote],
    (err, result) => {
      if (err)
        return res.status(500).json({ success: false, message: err.message });

      res.json({
        success: true,
        message: "Session requested successfully",
        sessionId: result.insertId,
      });
    }
  );
});

sessionRouter.get("/tutor-info/:tutorSubjectId", (req, res) => {
  const { tutorSubjectId } = req.params;

  const sql = `
    SELECT 
      ts.tutorSubjectId,
      ts.grade,
      ts.teachingMedium,
      s.subjectId,
      s.subjectName,
      u.userId AS tutorId,
      u.fullName AS tutorName
    FROM tutorSubject ts
    JOIN subject s ON ts.subjectId = s.subjectId
    JOIN tutor t ON ts.tutorId = t.userId
    JOIN users u ON t.userId = u.userId
    WHERE ts.tutorSubjectId = ?
  `;

  db.query(sql, [tutorSubjectId], (err, rows) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });
    if (rows.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Tutor not found" });

    res.json({ success: true, data: rows[0] });
  });
});

// Fetching tutor sessions
sessionRouter.get("/tutor/:tutorId/sessions", (req, res) => {
  const tutorId = parseInt(req.params.tutorId, 10);
  const { status } = req.query;

  if (isNaN(tutorId)) {
    return res.status(400).json({ success: false, message: "Invalid tutorId" });
  }

  // Auth & ownership check (assumes req.user is set by your auth middleware)
  // Tutors may only request their own sessions; admins allowed
  if (req.user?.role === "tutor" && req.user.userId !== tutorId) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  // Build SQL — select only the fields we need now (include zoomUrl, studentNote, tutorNote)
  let sql = `
    SELECT
      s.sessionId,
      s.date,
      s.startTime,
      s.duration,
      s.sessionStatus,
      s.zoomUrl,
      s.studentNote,
      s.tutorNote,

      -- verification status (no verifiedAt)
      v.status AS verificationStatus,

      -- Tutor info (just ID & name maybe)
t.userId AS tutorId,
tu.fullName AS tutorName,

-- Student info including profile photo
stu.userId AS studentId,
su.fullName AS studentName,
su.profilePhoto AS studentProfilePhoto,


      -- subject & tutorSubject info
      sub.subjectName,
      ts.grade,
      ts.teachingMedium

    FROM session s
    JOIN tutorSubject ts ON s.tutorSubjectId = ts.tutorSubjectId
    JOIN subject sub ON ts.subjectId = sub.subjectId
    JOIN tutor t ON ts.tutorId = t.userId
    JOIN users tu ON t.userId = tu.userId
    JOIN student stu ON s.studentId = stu.userId
    JOIN users su ON stu.userId = su.userId
    LEFT JOIN verification v ON s.verificationId = v.verificationId
    WHERE ts.tutorId = ?
  `;

  const params = [tutorId];

  // Optional status filter
  if (status) {
    sql += " AND s.sessionStatus = ?";
    params.push(status);
  }

  // Optional: order by upcoming first
  sql += " ORDER BY s.date ASC, s.startTime ASC";

  db.query(sql, params, (err, rows) => {
    if (err)
      return res.status(500).json({ success: false, message: err.message });

    // Return results (empty array is fine)
    return res.json({ success: true, data: rows });
  });
});

// Accept or Reject a session
sessionRouter.put("/:sessionId/status", (req, res) => {
  const sessionId = parseInt(req.params.sessionId, 10);
  const { status, tutorNote } = req.body;

  if (isNaN(sessionId)) {
    return res.status(400).json({ success: false, message: "Invalid sessionId" });
  }

  if (!status || !["Accepted", "Declined"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const sql = `
    UPDATE session
    SET sessionStatus = ?, tutorNote = ?
    WHERE sessionId = ?
  `;

  db.query(sql, [status, tutorNote || null, sessionId], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }
    res.json({ success: true, message: `Session ${status.toLowerCase()} successfully` });
  });
});

// fetching student sessions
sessionRouter.get("/student/:studentId/sessions", (req, res) => {
  const studentId = parseInt(req.params.studentId, 10);
  const { status } = req.query;

  if (isNaN(studentId)) {
    return res.status(400).json({ success: false, message: "Invalid studentId" });
  }

  // Optional: auth check, make sure req.user.userId === studentId or admin
  if (req.user?.role === "student" && req.user.userId !== studentId) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  let sql = `
    SELECT
      s.sessionId,
      s.date,
      s.startTime,
      s.duration,
      s.sessionStatus,
      s.zoomUrl,
      s.studentNote,
      s.tutorNote,

      -- Tutor info
      t.userId AS tutorId,
      tu.fullName AS tutorName,
      tu.profilePhoto AS tutorProfilePhoto,

      -- Subject & grade info
      sub.subjectName,
      ts.grade,
      ts.teachingMedium

    FROM session s
    JOIN tutorSubject ts ON s.tutorSubjectId = ts.tutorSubjectId
    JOIN subject sub ON ts.subjectId = sub.subjectId
    JOIN tutor t ON ts.tutorId = t.userId
    JOIN users tu ON t.userId = tu.userId
    WHERE s.studentId = ?
  `;

  const params = [studentId];

  if (status) {
    sql += " AND s.sessionStatus = ?";
    params.push(status);
  }

  sql += " ORDER BY s.date ASC, s.startTime ASC";

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: rows });
  });
});

// GET /session/:id
sessionRouter.get("/:id", (req, res) => {
  const sessionId = req.params.id;

  const sql = `
    SELECT 
      s.sessionId,
      s.date,
      s.startTime,
      s.duration,
      s.sessionStatus,
      s.zoomUrl,
      s.studentNote,
      s.tutorNote,
      s.studentId,
      ts.tutorId,
      sub.subjectName,
      ts.grade,
      ts.teachingMedium,
      v.verificationId,
      v.status AS verificationStatus,
      v.verifiedAt,
      v.verifiedNotes,
      v.verifiedByAdminId,
      adminUser.fullName AS verifiedByName,
      adminUser.email AS verifiedByEmail
    FROM session s
    JOIN tutorSubject ts ON s.tutorSubjectId = ts.tutorSubjectId
    JOIN subject sub ON ts.subjectId = sub.subjectId
    LEFT JOIN verification v ON s.verificationId = v.verificationId
    LEFT JOIN admin a ON v.verifiedByAdminId = a.userId
    LEFT JOIN users adminUser ON a.userId = adminUser.userId
    WHERE s.sessionId = ?
  `;

  db.query(sql, [sessionId], (err, sessions) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (sessions.length === 0) return res.status(404).json({ success: false, message: "Session not found" });

    res.json({ success: true, data: sessions[0] });
  });
});

// ===========================
// Check student session conflict (fixed 2-hour duration)
// ===========================
sessionRouter.get("/student/:studentId/check-conflict", (req, res) => {
  const studentId = parseInt(req.params.studentId, 10);
  const { date, startTime } = req.query;

  if (!studentId || !date || !startTime) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields (studentId, date, startTime)"
    });
  }

  // Fixed duration = 120 mins
  const duration = 120;

  // Convert new session time → minutes
  const [sh, sm] = startTime.split(":").map(Number);
  const newStart = sh * 60 + sm;
  const newEnd = newStart + duration;

  const sql = `
    SELECT sessionId, date, startTime, duration, sessionStatus
    FROM session
    WHERE studentId = ?
      AND date = ?
      AND sessionStatus IN ('Requested', 'Accepted', 'Submitted')
  `;

  db.query(sql, [studentId, date], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    if (rows.length === 0) {
      return res.json({ success: true, conflict: false });
    }

    for (const session of rows) {
      const [eh, em] = session.startTime.split(":").map(Number);
      const existingStart = eh * 60 + em;
      const existingEnd = existingStart + session.duration;

      // Check overlap
      const isOverlap = newStart < existingEnd && newEnd > existingStart;

      if (isOverlap) {
        return res.json({
          success: true,
          conflict: true,
          message: "You already have a session at this time on the same date.",
          conflictingSession: session
        });
      }
    }

    return res.json({ success: true, conflict: false });
  });
});

// ===========================
// Check tutor session conflict
// ===========================
sessionRouter.get("/tutor/:tutorId/check-conflict", (req, res) => {
  const tutorId = parseInt(req.params.tutorId, 10);
  const { date, startTime } = req.query;

  if (!tutorId || !date || !startTime) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields (tutorId, date, startTime)"
    });
  }

  const duration = 120; // fixed 2 hours

  const [sh, sm] = startTime.split(":").map(Number);
  const newStart = sh * 60 + sm;
  const newEnd = newStart + duration;

  const sql = `
    SELECT sessionId, date, startTime, duration, sessionStatus
    FROM session s
    JOIN tutorSubject ts ON s.tutorSubjectId = ts.tutorSubjectId
    WHERE ts.tutorId = ? 
      AND s.date = ? 
      AND s.sessionStatus = 'Accepted'
  `;

  db.query(sql, [tutorId, date], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    if (rows.length === 0) return res.json({ success: true, conflict: false });

    for (const session of rows) {
      const [eh, em] = session.startTime.split(":").map(Number);
      const existingStart = eh * 60 + em;
      const existingEnd = existingStart + session.duration;

      const isOverlap = newStart < existingEnd && newEnd > existingStart;
      if (isOverlap) {
        return res.json({
          success: true,
          conflict: true,
          message: "You already have an accepted session at this time.",
          conflictingSession: session
        });
      }
    }

    return res.json({ success: true, conflict: false });
  });
});



export default sessionRouter;
