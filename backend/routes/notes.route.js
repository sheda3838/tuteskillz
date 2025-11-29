// backend/routes/notes.js
import express from "express";
import db from "../config/db.js"; 
import { base64ToBuffer } from "../utils/fileHelper.js";

const router = express.Router();

/**
 * Upload notes (PDF) for a session and store in MySQL LONGBLOB
 */
router.post("/upload", (req, res) => {
  const { sessionId, title, file } = req.body;

  if (!sessionId || !title || !file) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  // Convert base64 to buffer
  const fileBuffer = base64ToBuffer(file);
  if (!fileBuffer) {
    return res.status(400).json({ success: false, message: "Invalid file format" });
  }

  // Insert into DB
  const query = "INSERT INTO notes (sessionId, title, document) VALUES (?, ?, ?)";
  db.query(query, [sessionId, title, fileBuffer], (err, result) => {
    if (err) {
      console.error("Error uploading notes:", err);
      return res.status(500).json({ success: false, message: "Failed to upload notes" });
    }

    return res.status(200).json({ success: true, message: "Notes uploaded successfully", noteId: result.insertId });
  });
});

/**
 * Get notes for a session
 */
router.get("/:sessionId", (req, res) => {
  const sessionId = req.params.sessionId;

  if (!sessionId) {
    return res.status(400).json({ success: false, message: "Missing session ID" });
  }

  const query = "SELECT noteId, title FROM notes WHERE sessionId = ?";
  db.query(query, [sessionId], (err, results) => {
    if (err) {
      console.error("Error fetching notes:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch notes" });
    }

    return res.status(200).json({ success: true, notes: results });
  });
});

/**
 * Get notes for a session
 */
router.get("/:sessionId/:noteId", (req, res) => {
  const { sessionId, noteId } = req.params;

  if (!sessionId || !noteId) {
    return res.status(400).json({ success: false, message: "Missing session ID or note ID" });
  }

  const query = "SELECT title, document FROM notes WHERE sessionId = ? AND noteId = ?";
  db.query(query, [sessionId, noteId], (err, results) => {
    if (err) {
      console.error("Error fetching note:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch note" });
    }

    if (!results.length) return res.status(404).json({ success: false, message: "Note not found" });

    const note = results[0];
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${note.title}.pdf"`);
    res.send(note.document); // send raw buffer
  });
});




export default router;
