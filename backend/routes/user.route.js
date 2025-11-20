import { Router } from "express";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import db from "../config/db.js";
import dotenv from "dotenv";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";

dotenv.config();

const userRouter = Router();

// ===========================
//  Manual Signup
// ===========================
userRouter.post("/signup", async (req, resp) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return resp.json({
      success: false,
      error: "Email and password are required",
    });
  }

  try {
    db.query(
      "SELECT * FROM tempUsers WHERE email = ?",
      [email],
      async (err, data) => {
        if (err) return resp.json({ success: false, error: err.message });
        if (data.length > 0) return resp.json({ exists: true });

        const hash = await bcrypt.hash(password, 10);
        const token = crypto.randomBytes(32).toString("hex");
        const values = [email, hash, false, token];

        db.query(
          "INSERT INTO tempUsers (`email`, `password`, `isVerified`, `verificationToken`) VALUES (?, ?, ?, ?)",
          values,
          async (err2) => {
            if (err2) return resp.json({ success: false, error: err2.message });

            // Send verification email
            try {
              // Send verification email
              const emailHtml = `
<div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f8; padding: 40px; text-align: center;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <img src="/assets/Logo.png" alt="TuteSkillz Logo" style="width: 80px; margin-bottom: 20px;" />
    <h2 style="color: #2a2a2a;">Welcome to <span style="color: #0078ff;">TuteSkillz!</span></h2>
    <p style="color: #555; font-size: 16px; line-height: 1.6;">
      Please verify your email address to activate your account.
    </p>
    <a href="${process.env.FRONTEND_URL}verify-email?token=${token}"
       style="display: inline-block; background-color: #0078ff; color: #fff; text-decoration: none;
              padding: 12px 30px; border-radius: 6px; margin-top: 20px; font-weight: bold; font-size: 16px;">
      Verify Email
    </a>
  </div>
</div>
`;

              await sendEmail(email, "Verify your email", emailHtml);

              return resp.json({
                success: true,
                message: "Check your email to verify your account",
              });
            } catch (emailErr) {
              console.error("Email sending failed:", emailErr);
              return resp.json({
                success: false,
                error: "Failed to send verification email. Please try again.",
              });
            }
          }
        );
      }
    );
  } catch (err) {
    resp.json({ success: false, error: err.message });
  }
});

// ===========================
//  Manual Signin
// ===========================
userRouter.post("/signin", async (req, resp) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return resp.json({
      success: false,
      error: "Email and password are required",
    });
  }

  try {
    db.query(
      "SELECT * FROM tempUsers WHERE email = ?",
      [email],
      async (err, data) => {
        if (err) return resp.json({ success: false, error: err.message });

        if (data.length === 0) {
          return resp.json({ success: false, error: "User not found" });
        }

        const user = data[0];

        // Check verification
        if (!user.isVerified) {
          return resp.json({
            success: false,
            error: "Please verify your email first",
          });
        }

        // Compare password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return resp.json({ success: false, error: "Incorrect password" });
        }

        // Store session
        req.session.email = user.email;
        req.session.userId = user.tempUserId;

        resp.json({ success: true, message: "Signin successful" });
      }
    );
  } catch (err) {
    resp.json({ success: false, error: err.message });
  }
});

// ===========================
//  Email Verification
// ===========================
userRouter.get("/verify-email", (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: "Verification token is required",
    });
  }

  db.query(
    "SELECT * FROM tempUsers WHERE verificationToken = ?",
    [token],
    (err, data) => {
      if (err) {
        return res.status(500).json({ success: false, error: "Server error" });
      }

      if (data.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Invalid or expired token",
        });
      }

      db.query(
        "UPDATE tempUsers SET isVerified = true, verificationToken = NULL WHERE tempUserId = ?",
        [data[0].tempUserId],
        (err2) => {
          if (err2) {
            return res
              .status(500)
              .json({ success: false, error: "Server error" });
          }

          return res.json({
            success: true,
            message: "Email verified! You can now log in.",
          });
        }
      );
    }
  );
});

// ===========================
//  Google OAuth
// ===========================
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

userRouter.post("/google/token", async (req, resp) => {
  const { token } = req.body;

  if (!token) {
    return resp
      .status(400)
      .json({ success: false, message: "Token is required" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;

    db.query(
      "SELECT * FROM tempUsers WHERE email = ?",
      [email],
      (err, data) => {
        if (err) {
          return resp
            .status(500)
            .json({ success: false, message: err.message });
        }

        if (data.length > 0) {
          const user = data[0];
          req.session.userId = user.tempUserId;
          req.session.email = user.email;
          return resp.json({ success: true, message: "Login successful" });
        } else {
          const values = [email, true];
          db.query(
            "INSERT INTO tempUsers (email, isVerified) VALUES (?,  ?)",
            values,
            (err2, result) => {
              if (err2) {
                return resp
                  .status(500)
                  .json({ success: false, message: err2.message });
              }

              req.session.userId = result.insertId;
              req.session.email = email;

              return resp.json({ success: true, message: "Signup successful" });
            }
          );
        }
      }
    );
  } catch (err) {
    console.error("Google OAuth error:", err);
    resp.status(401).json({ success: false, message: "Invalid Google token" });
  }
});

// ===========================
//  Check if User Exists in Main Users Table
// ===========================
userRouter.get("/user", (req, res) => {
  const email = req.session.email;

  if (!email) {
    return res.json({
      success: false,
      message: "Unauthorized Access",
    });
  }

  // Check if this email exists in the main users table
  const sql = "SELECT userId, fullName,role FROM users WHERE email = ?";
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error("Error checking user role:", err);
      return res.status(500).json({
        success: false,
        message: "Server error while checking user role",
      });
    }

    // If no record found, means it's a new user
    if (result.length === 0) {
      return res.json({
        success: true,
        loggedin: true,
        isNewUser: true,
        message: "Welcome to Tuteskillz - complete registration",
      });
    }

    // Found user - return their role
    const role = result[0].role;
    const fullName = result[0].fullName;
    const userId = result[0].userId;

    return res.json({
      success: true,
      isNewUser: false,
      role: role,
      loggedin: true,
      userId: userId,
      email: req.session.email,
      fullName: fullName,
    });
  });
});

// ===========================
//  Logout
// ===========================
userRouter.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    res.clearCookie("connect.sid");
    return res.json({ success: true, message: "Logged out successfully" });
  });
});

export default userRouter;
