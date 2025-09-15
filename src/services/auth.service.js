// implementing hashing per password
import bcrypt from 'bcrypt';
import logger from "../config/logger";
import { db } from "../config/database.js";
import { users } from "../models/user.model.js";
import { eq } from 'drizzle-orm';

export const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10); // 10 is the salt rounds
  } catch (e) {
    logger.error(`Error hashing password: ${e.message}`);
    throw new Error('Password hashing failed');
  }
} 

export const createUser = async ({ name, email, password, role = 'user' }) => {
    try {
        // Check if user with the email already exists
        const existingUser = await db.select()
            .from('users')
            .where(eq(users.email, email))
            .limit(1)

        if (existingUser.length > 0) {
            throw new Error('User with this email already exists');
        }
        // Hash the password before storing
        const hashedPassword = await hashPassword(password);
        // Insert the new user into the database
        const [newUser] = await db.insert(users)
            .values({
                name,
                email,
                password: hashedPassword,
                role
            })
            // return user details except password
            .returning({id:users.id, name:users.name, email:users.email, role:users.role}); 

        logger.info(`New user created created successfully: ${email}`);

        return newUser;
    } catch (e) {
        logger.error(`Error creating user: ${e.message}`);
        throw e; // rethrow the error for the controller to handle
    }
}

export const authenticateUser = async ({ email, password }) => {
  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!existingUser) {
      throw new Error('User not found');
    }

    const isPasswordValid = await comparePassword(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    logger.info(`User ${existingUser.email} authenticated successfully`);
    return {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
      created_at: existingUser.created_at,
    };
  } catch (e) {
    logger.error(`Error authenticating user: ${e}`);
    throw e;
  }
};