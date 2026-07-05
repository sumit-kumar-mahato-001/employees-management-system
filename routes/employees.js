const express = require("express");
const db = require("../config/db");

const router = express.Router();

function requireAuth(req, res, next) {
  if (!req.session.admin) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  next();
}

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";

    const [employees] = await db.execute(
      `SELECT
                e.id,
                e.employee_id,
                e.name,
                e.email,
                e.phone,
                e.department_id,
                d.name AS department_name,
                e.designation,
                e.salary,
                e.joining_date
            FROM employees e
            JOIN departments d
                ON e.department_id = d.id
            WHERE e.employee_id LIKE ?
               OR e.name LIKE ?
            ORDER BY e.id ASC`,
      [`%${search}%`, `%${search}%`],
    );

    res.json(employees);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Unable to load employees",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [employees] = await db.execute(
      "SELECT * FROM employees WHERE id = ?",
      [req.params.id],
    );

    if (employees.length === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.json(employees[0]);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Unable to load employee",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      employee_id,
      name,
      email,
      phone,
      department_id,
      designation,
      salary,
      joining_date,
    } = req.body;

    await db.execute(
      `INSERT INTO employees
            (
                employee_id,
                name,
                email,
                phone,
                department_id,
                designation,
                salary,
                joining_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employee_id,
        name,
        email,
        phone,
        department_id,
        designation,
        salary,
        joining_date,
      ],
    );

    res.status(201).json({
      message: "Employee added successfully",
    });
  } catch (error) {
    console.log(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Employee ID or email already exists",
      });
    }

    res.status(500).json({
      message: "Unable to add employee",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const {
      employee_id,
      name,
      email,
      phone,
      department_id,
      designation,
      salary,
      joining_date,
    } = req.body;

    const [result] = await db.execute(
      `UPDATE employees
             SET employee_id = ?,
                 name = ?,
                 email = ?,
                 phone = ?,
                 department_id = ?,
                 designation = ?,
                 salary = ?,
                 joining_date = ?
             WHERE id = ?`,
      [
        employee_id,
        name,
        email,
        phone,
        department_id,
        designation,
        salary,
        joining_date,
        req.params.id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.json({
      message: "Employee updated successfully",
    });
  } catch (error) {
    console.log(error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Employee ID or email already exists",
      });
    }

    res.status(500).json({
      message: "Unable to update employee",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM employees WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Unable to delete employee",
    });
  }
});

module.exports = router;
