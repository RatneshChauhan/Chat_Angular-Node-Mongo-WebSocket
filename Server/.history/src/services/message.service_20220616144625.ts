
import { Service } from 'typedi'
const Conversation = require('../models/conversation.model');

@Service()
//@ts-ignore
export class MessageService {

    constructor() { }

    public async getConversation(to, from) {
        const conversation = await Conversation.find({
            $and: [
                {
                    $or: [{ from: from }, { from: to }]
                },
                {
                    $or: [{ to: to }, { to: from }]
                }
            ]
        }).sort({ 'messages.sentAt': 1 })

        return conversation
    }

    public async  saveMessage(message: any) {

        const conversationId = message.to.recieverUserId + '--|--' + message.from.senderUserId

        const filter = { conversationId };
        const update = {
            to: message.to.recieverUserId,
            from: message.from.senderUserId,
            $push: {
                messages: {
                    to: message.to,
                    from: message.from,
                    text: message.text,
                    sentAt: message.ts
                }
            }
        };

        try {
            // `doc` is the document _after_ `update` was applied because of
            // `new: true`
            let doc = await Conversation.findOneAndUpdate(filter, update, {
                new: true,
                upsert: true // Make this update into an upsert
            });

            return doc;

        } catch (e) {
            console.log('MongoDB Error while saving message', e);
        }
    }

}
