import Conversation from "../models/conversation.models.js";
import { throwError } from "../utils/error.js";

export const getConversation = (req, res, next) => {
  res.send("listing from conversation");
};

export const createConversation = async (req, res, next) => {
  if (req.user.id != req.body.creatorId)
    return next(throwError(401, "user is not valid"));

  if (req.body.creatorId === req.body.perticipantId)
    return next(throwError(402, "request error"));

  try {
    // check is new conversation or not
    const conversations = await Conversation.find({
      $and: [
        { creatorId: req.body.creatorId },
        { participantId: req.body.participantId },
      ],
    });

    console.log(conversations);
    if (conversations.length === 0) {
      const newConversation = Conversation(req.body);
      await newConversation.save();
      res.status(201).json(newConversation);
    } else {
      res.status(403).json("conversation already exist");
    }
  } catch (error) {
    next(error);
  }
};
