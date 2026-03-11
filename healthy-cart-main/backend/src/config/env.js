import dotenv from "dotenv";

dotenv.config();

const required = ["MONGODB_URI", "JWT_SECRET"];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const emailUser = process.env.EMAIL_USER || "";
const emailPass = process.env.EMAIL_PASS || "";

if (!emailUser || !emailPass) {
  console.warn("[ENV WARNING] EMAIL_USER or EMAIL_PASS is not set. Order confirmation emails will be disabled.");
}

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI,
  mongoDbName: process.env.MONGODB_DB_NAME || "milletpro",
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL || "http://localhost:8080",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "",
  paymentProvider:
    process.env.PAYMENT_PROVIDER ||
    (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET ? "razorpay" : "mock"),
  paymentCurrency: process.env.PAYMENT_CURRENCY || "INR",
  mockPaymentOtp: process.env.MOCK_PAYMENT_OTP || "1221",
  emailHost: process.env.EMAIL_HOST || "smtp.gmail.com",
  emailPort: Number.parseInt(process.env.EMAIL_PORT || "587", 10),
  emailSecure: process.env.EMAIL_SECURE === "true",
  emailUser,
  emailPass,
  emailFromName: process.env.EMAIL_FROM_NAME || "Millet Pro",
  emailFromAddress: process.env.EMAIL_FROM_ADDRESS || emailUser,
};
