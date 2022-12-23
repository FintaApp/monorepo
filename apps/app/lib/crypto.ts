import crypto from "crypto";
import randomstring from "randomstring";

export const createToken = () => randomstring.generate(32);
export const hash = (string: string) => crypto.createHash('sha256').update(string).digest('hex');