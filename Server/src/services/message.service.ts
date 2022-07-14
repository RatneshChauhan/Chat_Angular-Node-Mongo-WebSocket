
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
        }).sort({ 'messages.ts': 1 })

        return conversation
    }

    public async upsertMessage(message: any, seen: boolean) {

        const conversationId = message.to.recieverUserId;
        const filter = { conversationId };

        if (seen) {
            await this.markAsSeen(conversationId)
        }
        else {
            const update = {
                to: message.to.recieverUserId,
                from: message.from.senderUserId,
                $push: {
                    messages: {
                        to: message.to,
                        from: message.from,
                        text: message.text,
                        ts: message.ts,
                        seen: message.seen
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
    private markAsSeen(id: string) {
        let doc = Conversation.collection.update({},
            {
                $set: {
                    "messages.$[elm].seen": true
                }
            },
            {
                multi: true,
                arrayFilters: [
                    {
                        "elm.to.recieverUserId": id
                    }
                ]
            })

        return doc;
    }
}
