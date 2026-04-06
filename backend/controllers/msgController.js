import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Messages.js"
import User from "../models/User.js"

export const getAllContacts = async (req, res) => {
    try {
    const LoggedInUserId = req.user._id ;
    const filteredUsers = await User.find({ _id: { $ne: LoggedInUserId }}).select("-password");   //just show the contacts not the login user

    res.status(200).json(filteredUsers);

    } catch (error) {
        console.error("Error in the getAllContacts", error);
        res.status(400).json({ message: "server error"})
    }
};

export const getMsgByUserId = async (req, res) => {
    try {
        const myId = req.user.id ;
        const { id: userToChatId } = req.params ;
        
        const messages = await Message.find({
            $or: [
                { senderId:myId , receiverId:userToChatId },
                { senderId:userToChatId , receiverId:myId },
            ]
        })

        res.status(200).json(messages);

    } catch (error) {
        console.error("Error in the getMsgByUserId", error);
        res.status(400).json({ message: "server error"})
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body ;
        const { id } = req.params; 
        const myId = req.user.id ;

        let imageUrl ;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image) ;
            imageUrl = uploadResponse.secure_url ;
        }

        const newMessage = new Message({
            senderId: myId ,
            receiverId: id,
            text,
            image: imageUrl ,
        })

        await newMessage.save();
        res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error in the sendMessage", error);
        res.status(400).json({ message: "server error"})
    }
};

export const getChatParteners = async (req, res) =>{
    try {
        const loggedInUser = req.user.id ;
        const messages = await Message.find({
            $or:[ {senderId: loggedInUser}, {receiverId: loggedInUser}] 
        });

        const chatPartnerIds = [...new Set(messages.map( (msg) => msg.senderId.toString() === loggedInUser.toString() ? msg.receiverId.toString() : msg.senderId.toString() ))]; //we get the partner ids here

        const chatPartners = await User.find({ _id: { $in:chatPartnerIds}});   //we get the users with those ids here

        res.status(201).json(chatPartners);
        
    } catch (error) {
        console.error("Error in getChatParteners controller", error);
        res.status(500).json({message: "internal server error"})
    }
}