const express = require('express');
const { register } = require('../controllers/Backend/Register.controller');
const { Login } = require('../controllers/Backend/Login.Controller');

const router = express.Router();

// Register
router.post('/register', register);

// Login
router.post('/login', Login);

/**
 * @swagger
 * /auth/validate-token:
 *   post:
 *     summary: Validate a user token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 is_valid:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Token is not valid
 *       400:
 *         description: Bad Request
 */

// router.post('/validate-token', async (req, res) => {
//   const token_data = req.headers.authorization;

//   const tokenArray = token_data.split(' ');
  
//   const token = tokenArray[1];
//   console.log("headers", token);
//   try {
//     jwt.verify(token, process.env.JWT_SECRET);
//   } catch (error) {
//     res.status(401).json({is_valid: false});
//   }
//   res.json({is_valid: true});
// });

// // Identify user
// router.post('/identify-user', IdentifyUser);

// router.post('/forgot-password', async (req, res) => {
//   const { email } = req.body;

//   try {
//       // Check if user exists
//       const user = await User.findOne({ where: { email } });
//       if (!user) {
//           return res.status(404).json({ message: 'User not found' });
//       }

//       // Generate a reset token
//       const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//       // Send the reset email
//       await sendResetEmail(email, token);
//       res.status(200).json({ message: 'Reset email sent' });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal server error' });
//   }
// });

// router.post('/reset-password', async (req, res) => {
//   const { token, newPassword } = req.body;

//   try {
//       // Verify the token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findByPk(decoded.id);

//       if (!user) {
//           return res.status(404).json({ message: 'User not found' });
//       }

//       user.password = newPassword;

//       if(user.status === 'invited') {
//         user.status = 'active';
//       }

//       await user.save();

//       res.status(200).json({ message: 'Password reset successful' });
//   } catch (error) {
//       console.error(`Error: ${error.message}`);
//       res.status(500).json({ message: 'Internal server error' });
//   }
// });

module.exports = router;
