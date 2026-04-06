import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjectProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ message: "Rate limit excceded" });

      } else if (decision.reason.isBot()) {
        res.status(403).json({ message: "Bot access denied" });

      } else {
        res.status(403).json({ message: "Access denied by security policy" });
      }
    }

    if(decision.results.some(isSpoofedBot)){
        res.status(403).json({ error: "Spoofed bot detected",message: "Malicious bot activity detected" });
    }

    next();

  } catch (error) {
    console.log("Arcject protection error");
    next();
  }
};
