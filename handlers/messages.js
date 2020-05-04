/** 
 * Message handlers.
 */

//Imports.
const db = require('../models');

/** 
 * Create message function to create a message.
 */
exports.createMessage = async function (req, res, next) {

    try {

        //Create the new message with the text and the user's id.
        let message = await db.Message.create({
            text: req.body.text,
            user: req.params.id
        });

        //Find the user by their id.
        let user = await db.User.findById(req.params.id);

        //Push the message id into their messages array.
        user.messages.push(message.id);

        //Save the user.
        await user.save();

        //Find the message by it's _id and attach the user's information to the message.
        let foundMessage = await db.Message.findById(message._id).populate("user", {
            username: true,
            profileImageUrl: true
        });

        //Return the found message.
        return res.status(200).json(foundMessage);

    } catch (e) {

        //Return next with the error.
        return next(e);
    }

};

/** 
 * Get message function to get a message.
 * GET - /api/users/:id/messages/:message_id
 */
exports.getMessage = async function (req, res, next) {

    try {

        //Find the message by it's message id.
        let message = await db.Message.find({
            _id: req.params.message_id
        });

        //Return the message.
        return res.status(200).json(message);

    } catch (e) {

        //Return next with the error.
        return next(e);
    }
};

/** 
 * Delete message function to delete a message.
 * DELETE - /api/users/:id/messages/:message_id
 */
exports.deleteMessage = async function (req, res, next) {

    try {

        //Find the message by it's id.
        let foundMessage = await db.Message.findById(req.params.message_id);

        //Remove the message.
        await foundMessage.remove();

        //Return the deleted message.
        res.status(200).json(foundMessage);

    } catch (e) {

        //Return next with the error.
        return next(e);
    }
};