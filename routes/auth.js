const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const [admins] = await db.execute(
      "SELECT * FROM admins WHERE username = ?",
      [username],
    );

    if (admins.length === 0) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    const admin = admins[0];

    const validPassword = await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    req.session.admin = {
      id: admin.id,
      username: admin.username,
    };

    req.session.save((error) => {
      if (error) {
        console.error("Session save error:", error);

        return res.status(500).json({
          message: "Login session error",
        });
      }

      res.json({
        message: "Login successful",
      });
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.get("/check", (req, res) => {
  res.json({
    loggedIn: Boolean(req.session.admin),
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout error:", error);

      return res.status(500).json({
        message: "Unable to logout",
      });
    }

    res.clearCookie("connect.sid");

    res.json({
      message: "Logout successful",
    });
  });
});

module.exports = router;
