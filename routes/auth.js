const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

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

    res.json({
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);

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
  req.session.destroy(() => {
    res.json({
      message: "Logout successful",
    });
  });
});

module.exports = router;
