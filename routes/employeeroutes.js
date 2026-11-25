const express = require('express')
const router = express.Router()

const {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeecontroller')

// READ
router.get('/', getEmployees)

// CREATE
router.post('/', createEmployee)

// UPDATE
router.put('/:id', updateEmployee)

// DELETE
router.delete('/:id', deleteEmployee)

module.exports = router