import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";

const SALT_ROUNDS = 10;

export async function registerUser(data: {
  email: string;
  password: string;
  name?: string;
}) {
  const { email, password, name } = data;

  if (!email || !password) {
    throw { statusCode: 400, message: "Email and password are required" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw { statusCode: 409, message: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      provider: "LOCAL",
    },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const { email, password } = data;

  if (!email || !password) {
    throw { statusCode: 400, message: "Email and password are required" };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    throw { statusCode: 401, message: "Invalid credentials" };
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw { statusCode: 401, message: "Invalid credentials" };
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
  };
}
