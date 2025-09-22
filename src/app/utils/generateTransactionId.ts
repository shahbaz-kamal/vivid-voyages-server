import crypto from "crypto";

export const generateTransactionId = () => {
  const timestamp = Date.now(); // milliseconds
  const random = crypto.randomBytes(6).toString("hex"); // 12-char random string
  return `trans_${timestamp}_${random}`;
};
