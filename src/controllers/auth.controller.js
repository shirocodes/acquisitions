import logger from '../config/logger.js';
import { signupSchema, signInSchema } from '../validations/auth.validations.js';
import { formatValidationError } from '../utils/format.js';
import { createUser, authenticateUser } from '../services/user.service.js';
import jwttoken from '../utils/jwt.js';
import cookies from '../utils/cookies.js';

export const signup = async (req, res, next) => {
    // Flow: validate -> create user -> generate token -> set cookie -> respond
  try {
    // step1: validate the request body against the signup schema
    const validationResult = signupSchema.safeParse(req.body);
    // step2: if validation fails, return a 400 response with error details
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }
    // step3: extract validated data
    const { name, email, password, role } = validationResult.data;

    // step4: create a new user in the database(service handles hashing password)
    const user = await createUser({ name, email, password, role });
    // step5: generate a JWT token for the new user (signed with user id and email)
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    // step6: set/store the JWT token in an HTTP-only cookie
    cookies.set(res, 'token', token);
    // step7: log the successful registration and return a 201 response with user details (excluding password)
    logger.info(`User registered successfully: ${email}`);
    res.status(201).json({
      message: 'User registered',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    logger.error('Signup error', e);

    if (e.message === 'User with this email already exists') {
      return res.status(409).json({ error: 'Email already exist' });
    }

    next(e); // Pass error to the next middleware (error handler)
  }
};

export const signIn = async (req, res, next) => {
    // Flow: validate -> authenticate user -> generate token -> set cookie -> respond
  try {
    // step1: Validate the request body against the sign-in schema
    const validationResult = signInSchema.safeParse(req.body);
    // If validation fails, return a 400 response with error details
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;
    // step2: Authenticate the user (service handles verifying password)
    const user = await authenticateUser({ email, password });
    // step3: Generate a JWT token for the authenticated user
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    // step4: Set/store the JWT token in an HTTP-only cookie
    cookies.set(res, 'token', token);
    // step5: Log the successful sign-in and return a 200 response with user details (excluding password)
    logger.info(`User signed in successfully: ${email}`);
    res.status(200).json({
      message: 'User signed in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    logger.error('Sign in error', e);

    if (e.message === 'User not found' || e.message === 'Invalid password') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    next(e); // Pass error to the next middleware (error handler)
  }
};

export const signOut = async (req, res, next) => {
    // flow: clear cookie -> respond
  try {
    cookies.clear(res, 'token');

    logger.info('User signed out successfully');
    res.status(200).json({
      message: 'User signed out successfully',
    });
  } catch (e) {
    logger.error('Sign out error', e);
    next(e);
  }
};
