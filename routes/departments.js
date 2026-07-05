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
    const [departments] = await db.execute(`
            SELECT
                d.id,
                d.name,
                COUNT(e.id) AS employee_count
            FROM departments d
            LEFT JOIN employees e
                ON d.id = e.department_id
            GROUP BY d.id, d.name
            ORDER BY d.id ASC
        `);

    res.json(departments);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Unable to load departments",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const name = req.body.name.trim();

    await db.execute("INSERT INTO departments (name) VALUES (?)", [name]);

    res.json({
      message: "Department added successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Department already exists",
    });
  }
});

router.put("/:oldId", async (req, res) => {
  try {
    const oldId = req.params.oldId;
    const { id, name } = req.body;

    if (!id || !name || !name.trim()) {
      return res.status(400).json({
        message: "Department ID and name are required",
      });
    }

    await db.execute(
      `UPDATE departments
             SET id = ?, name = ?
             WHERE id = ?`,
      [id, name.trim(), oldId],
    );

    res.json({
      message: "Department updated successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      message: "Department ID or name already exists",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await db.execute("DELETE FROM departments WHERE id = ?", [req.params.id]);

    res.json({
      message: "Department deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Cannot delete department assigned to employees",
    });
  }
});

module.exports = router;
