const pool = require('../config/db')

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM employees ORDER BY id DESC'
    )
    //getting employee data from database 
    res.status(200).json(result.rows)

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch employees'
    })
  }
}


// Create employee
exports.createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      department,
      position,
      salary
    } = req.body

    if (
        //trim is used for user input is space or not 
      !name?.trim() ||
      !email?.trim() ||
      !department?.trim() ||
      !position?.trim()
    ) {
      return res.status(400).json({
        message: 'Please fill all required fields'
      })
    }

    if (!Number.isFinite(Number(salary)) || Number(salary) < 0) {
      return res.status(400).json({
        message: 'Salary must be a valid non-negative number'
      })
    }

    const result = await pool.query(
      `INSERT INTO employees
      (name, email, phone, department, position, salary)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        name.trim(),
        email.trim(),
        phone || null,
        department.trim(),
        position.trim(),
        Number(salary)
      ]
    )

    res.status(201).json({
      message: 'Employee created successfully',
      data: result.rows[0]
    })

  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        message: 'Email already exists'
      })
    }

    console.error(error)

    res.status(500).json({
      message: 'Failed to create employee'
    })
  }
}


// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params

    const {
      name,
      email,
      phone,
      department,
      position,
      salary
    } = req.body

    if (
      !name?.trim() ||
      !email?.trim() ||
      !department?.trim() ||
      !position?.trim()
    ) {
      return res.status(400).json({
        message: 'Please fill all required fields'
      })
    }

    if (!Number.isFinite(Number(salary)) || Number(salary) < 0) {
      return res.status(400).json({
        message: 'Invalid salary'
      })
    }

    const result = await pool.query(
      `UPDATE employees
       SET name = $1,
           email = $2,
           phone = $3,
           department = $4,
           position = $5,
           salary = $6
       WHERE id = $7
       RETURNING *`,
      [
        name.trim(),
        email.trim(),
        phone || null,
        department.trim(),
        position.trim(),
        Number(salary),
        id
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Employee not found'
      })
    }

    res.status(200).json({
      message: 'Employee updated successfully',
      data: result.rows[0]
    })

  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        message: 'Email already exists'
      })
    }

    console.error(error)

    res.status(500).json({
      message: 'Failed to update employee'
    })
  }
}

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      'DELETE FROM employees WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Employee not found'
      })
    }

    res.status(200).json({
      message: 'Employee deleted successfully'
    })

  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to delete employee'
    })
  }
}