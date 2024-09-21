const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const {db}=require("../db/db")


const router = express.Router();





// Display the registration form
router.get('/', (req, res) => {
    res.render('register'); // This renders the register.ejs form
});

// User Registration
router.post('/register', [
    body('fname').notEmpty().withMessage('First name is required'),
    body('sname').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fname, sname, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await db.User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = await db.User.create({
            fname,
            sname,
            email,
            password: hashedPassword
        });

        res.redirect("/recommndations")
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});




router.get('/login', (req, res) => {
    res.render('login'); // This renders the register.ejs form
});
router.get('/logout', (req, res) => {
     req.session.destroy()
     res.redirect("/users/login")
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists by email
        const user = await db.User.findOne({ where: { email } });

        if (!user) {
            return res.render('login', {
                errors: [{ msg: 'Invalid email or password' }]
            });
        }

        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.render('login', {
                errors: [{ msg: 'Invalid email or password' }]
            });
        }

        // If the password matches, create a session or JWT token
        req.session.userId = user.id; // Simple session example
        res.redirect('/recommndations'); // Redirect to some protected route after login
    } catch (err) {
        console.error(err.message);
        res.render('login', {
            errors: [{ msg: 'An error occurred during login. Please try again.' }]
        });
    }
});



router.get("/dashboard",(req,res)=>{
    return res.json("dashboard")
})
module.exports = router;
