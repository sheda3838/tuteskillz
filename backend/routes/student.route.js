import { Router } from "express";
import db from "../config/db.js";
import { base64ToBuffer } from "../utils/fileHelper.js";

const studentRouter = Router();

studentRouter.post("/register", (req, resp) => {
  const {
    fullName,
    gender,
    dob,
    phone,
    grade,
    gFullName,
    gEmail,
    gPhone,
    street,
    city,
    province,
    postalCode,
    profilePic,
  } = req.body;

  const email = req.session.email;

  if (!email) {
    return resp
      .status(401)
      .json({ success: false, message: "Unauthorized: No email in session" });
  }

  // start transaction
  db.beginTransaction((err) => {
    if (err)
      return resp.status(500).json({ success: false, message: err.message });

    // 1️⃣ get password from tempUsers
    db.query(
      "SELECT password FROM tempUsers WHERE email = ?",
      [email],
      (err, tempUserRows) => {
        if (err)
          return db.rollback(() =>
            resp.status(500).json({ success: false, message: err.message })
          );
        if (tempUserRows.length === 0)
          return db.rollback(() =>
            resp.status(404).json({ success: false, message: "User not found" })
          );

        const password = tempUserRows[0].password ?? null;

        // 2️⃣ insert address
        db.query(
          "INSERT INTO address (street, city, province, postalCode) VALUES (?,?,?,?)",
          [street, city, province, postalCode],
          (err, addressResult) => {
            if (err)
              return db.rollback(() =>
                resp.status(500).json({ success: false, message: err.message })
              );

            const addressId = addressResult.insertId;

            // 3️⃣ insert guardian
            db.query(
              "INSERT INTO guardian (fullName, email, phone) VALUES (?,?,?)",
              [gFullName, gEmail, gPhone],
              (err, guardianResult) => {
                if (err)
                  return db.rollback(() =>
                    resp
                      .status(500)
                      .json({ success: false, message: err.message })
                  );

                const guardianId = guardianResult.insertId;

                // 4️⃣ insert user
                db.query(
                  "INSERT INTO users (fullName, gender, dob, phone, addressId, email, password, role, profilePhoto) VALUES (?,?,?,?,?,?,?,?,?)",
                  [
                    fullName,
                    gender,
                    dob,
                    phone,
                    addressId,
                    email,
                    password,
                    "student",
                    base64ToBuffer(profilePic) || null,
                  ],
                  (err, userResult) => {
                    if (err)
                      return db.rollback(() =>
                        resp
                          .status(500)
                          .json({ success: false, message: err.message })
                      );

                    const userId = userResult.insertId;

                    // 5️⃣ insert student
                    db.query(
                      "INSERT INTO student (userId, guardianId, grade) VALUES (?,?, ?)",
                      [userId, guardianId, grade],
                      (err, studentResult) => {
                        if (err)
                          return db.rollback(() =>
                            resp
                              .status(500)
                              .json({ success: false, message: err.message })
                          );

                        // ✅ commit transaction
                        db.commit((err) => {
                          if (err)
                            return db.rollback(() =>
                              resp
                                .status(500)
                                .json({ success: false, message: err.message })
                            );

                          return resp.json({
                            success: true,
                            message: "Student registered successfully",
                          });
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

// ============================
// 1️⃣ Get available mediums
// ============================
studentRouter.get("/tutors/mediums", (req, resp) => {
  const sql = `
    SELECT DISTINCT ts.teachingMedium
    FROM tutorSubject ts
    JOIN tutor t ON ts.tutorId = t.userId
    JOIN verification v ON t.verificationId = v.verificationId
    WHERE v.status = 'Approved'
  `;
  db.query(sql, (err, rows) => {
    if (err)
      return resp.status(500).json({ success: false, message: err.message });
    const mediums = rows.map((r) => r.teachingMedium);
    resp.json({ success: true, data: mediums });
  });
});

// ============================
// 2️⃣ Get grades by medium
// ============================
studentRouter.get("/tutors/grades", (req, resp) => {
  const { medium } = req.query;
  if (!medium)
    return resp
      .status(400)
      .json({ success: false, message: "Medium is required" });

  const sql = `
    SELECT DISTINCT ts.grade
    FROM tutorSubject ts
    JOIN tutor t ON ts.tutorId = t.userId
    JOIN verification v ON t.verificationId = v.verificationId
    WHERE ts.teachingMedium = ? AND v.status = 'Approved'
    ORDER BY ts.grade
  `;
  db.query(sql, [medium], (err, rows) => {
    if (err)
      return resp.status(500).json({ success: false, message: err.message });
    const grades = rows.map((r) => r.grade);
    resp.json({ success: true, data: grades });
  });
});

// ============================
// 3️⃣ Get subjects by medium + grade
// ============================
studentRouter.get("/tutors/subjects", (req, resp) => {
  const { medium, grade } = req.query;
  if (!medium || !grade)
    return resp
      .status(400)
      .json({ success: false, message: "Medium and grade are required" });

  const sql = `
    SELECT DISTINCT s.subjectId, s.subjectName
    FROM tutorSubject ts
    JOIN subject s ON ts.subjectId = s.subjectId
    JOIN tutor t ON ts.tutorId = t.userId
    JOIN verification v ON t.verificationId = v.verificationId
    WHERE ts.teachingMedium = ? AND ts.grade = ? AND v.status = 'Approved'
  `;
  db.query(sql, [medium, grade], (err, rows) => {
    if (err)
      return resp.status(500).json({ success: false, message: err.message });
    resp.json({ success: true, data: rows });
  });
});

// ============================
// 4️⃣ Get tutors by medium + grade + subject
// ============================
studentRouter.get("/tutors", (req, resp) => {
  const { medium, grade, subjectId } = req.query;
  if (!medium || !grade || !subjectId)
    return resp
      .status(400)
      .json({
        success: false,
        message: "Medium, grade, and subjectId are required",
      });

  const sql = `
  SELECT ts.tutorSubjectId, u.userId, u.fullName, u.profilePhoto, t.bio
  FROM tutorSubject ts
  JOIN tutor t ON ts.tutorId = t.userId
  JOIN users u ON t.userId = u.userId
  JOIN verification v ON t.verificationId = v.verificationId
  WHERE ts.teachingMedium = ? AND ts.grade = ? AND ts.subjectId = ? AND v.status = 'Approved'
`;

  db.query(sql, [medium, grade, subjectId], (err, rows) => {
    if (err)
      return resp.status(500).json({ success: false, message: err.message });
    resp.json({ success: true, data: rows });
  });
});

export default studentRouter;
