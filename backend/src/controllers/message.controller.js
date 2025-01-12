import User from "../models/user.model.js";
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";

export const getUserForSidebar = async (req,res) => {
    try{
        const loggedInUserId = req.user._id;
        // find all the user except the current logged-in user.
        const filteredUser = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUser);
    } catch(error){
        console.log("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const getMessages = async (req,res) => {
    try{
        const {id:myFriendId} = req.params;
        const myId = req.user._id;

        const message = await Message.find({
            $or:[
                {senderId:myId, receiverId:myFriendId},
                {senderId:myFriendId, receiverId:myId}
            ]
        })
        res.status(200).json(message)
    }catch(error){
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({error: "Internal server error."})
    }
}

export const sendMessage = async (req,res) => {
    try{
        const {text, image} = req.body;
        const {id:myFriendId} = req.params;
        const myId = req.user._id;

        let imageURL ;
        if(image){
            // upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
        }

        const newMessage = new Message({myFriendId, myId, text, image:imageURL})

        await newMessage.save();

        // todo: socket.io
    }
    catch(error){
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({error : "Internal server error"});
    }
}