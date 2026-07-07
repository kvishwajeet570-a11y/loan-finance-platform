// src/helpers/password.ts

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/* ========================================
   HASH PASSWORD
======================================== */

export const hashPassword = async (
  password: string
): Promise<string> => {
  return bcrypt.hash(
    password,
    SALT_ROUNDS
  );
};

/* ========================================
   COMPARE PASSWORD
======================================== */

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(
    plainPassword,
    hashedPassword
  );
};