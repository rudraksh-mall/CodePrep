const { Router } = require('express');
const { z } = require('zod');
const validate = require('../middleware/validate.middleware');
const authenticate = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
