import express from "express"
import { getAllContacts, getMsgByUserId, sendMessage, getChatParteners} from "../controllers/msgController.js";
import { arcjectProtection } from "../middlewares/arcjet.middleware.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

// The middleware execute in order- so requests get rate-limited first, then authenticated.
// This is more efficient since the unauthenticated requests get blocked by the rate-limiting before hitting the auht middleware.
router.use(arcjectProtection, protectRoute );

router.get("/contacts", getAllContacts );
router.get("/chats", getChatParteners );
router.get("/:id", getMsgByUserId );

router.post("/send/:id", sendMessage );

export default router;