const express = require("express");
const session = require("express-session");
const path = require("path");
const db = require("./config/db");

const authRoutes = require("./routes/auth");
const employeeRoutes = require("./routes/employees");
const departmentRoutes = require("./routes/departments");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(
  session({
    secret: "employee-management-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
    },
  }),
);

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);

app.get("/api/dashboard", async (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const [[employeeResult]] = await db.execute(
      "SELECT COUNT(*) AS total FROM employees",
    );

    const [[departmentResult]] = await db.execute(
      "SELECT COUNT(*) AS total FROM departments",
    );

    res.json({
      totalEmployees: employeeResult.total,
      totalDepartments: departmentResult.total,
      username: req.session.admin.username,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      message: "Database error",
    });
  }
});

app.get("/api/database-test", async (req, res) => {
  try {
    await db.execute("SELECT 1");

    res.json({
      message: "MySQL database connected successfully",
    });
  } catch (error) {
    console.error("Database Connection Error:", error);

    res.status(500).json({
      message: "MySQL database connection failed",
    });
  }
});

app.get("/", (req, res) => {
  res.redirect("/login.html");
});

app.use("/api", (req, res) => {
  res.status(404).json({
    message: "API route not found",
  });
});

app.use((error, req, res, next) => {
  console.error("Server Error:", error);

  res.status(500).json({
    message: "Internal server error",
  });
});

async function startServer() {
  try {
    await db.execute("SELECT 1");

    console.log("MySQL connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to MySQL");
    console.error(error.message);

    process.exit(1);
  }
}

startServer();
