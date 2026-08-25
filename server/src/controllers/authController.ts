import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const adminEmail = env.adminEmail || "admin@church.local";
    const adminPassword = env.adminPassword || "changeme123";
    const jwtSecret = env.jwtSecret || "dev-secret-change-me";

    if (email !== adminEmail) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const hash = await bcrypt.hash(adminPassword, 10);
    const valid = await bcrypt.compare(password, hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: "admin",
        email
      },
      jwtSecret,
      { expiresIn: "12h" }
    );

    return res.json({ token });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error("Login error:", err);
    return res.status(500).json({ error: err?.message || "Login failed" });
  }
}
