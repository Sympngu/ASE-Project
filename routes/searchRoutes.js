const express = require('express');
const pool = require('../config/db');
const router = express.Router();
const { check, validationResult } = require('express-validator'); // für Validierung



// Search route
router.get('/', [
    // Validate query parameters
    check('kategorie').optional().isString().trim().escape().withMessage('Kategorie must be a valid string'),
    check('land').optional().isString().trim().escape().withMessage('Land must be a valid string'),
], async (req, res) => {
    // Check validation results
    console.log('Received request for /api/sucherezept');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { kategorie, land} = req.query;

    try {
        // Start SQL query
        let query = 'SELECT * FROM rezepte WHERE 1=1'; // Placeholder condition for flexible filtering
        const values = [];

        // Filter for category
        if (kategorie) {
            query += ' AND kategorie = $' + (values.length + 1);
            values.push(kategorie);
        }

        // Filter for country
        if (land) {
            query += ' AND land = $' + (values.length + 1);
            values.push(land);
        }

    

        // Execute the query
        const result = await pool.query(query, values);

        // Return results
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No recipes found matching your criteria.' });
        }

        res.json(result.rows);
    } catch (error) {
        console.error('Database query error: ', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Export the router
module.exports = router;