import express from 'express'; 
import { prisma } from '../../lib/prisma.js'; 
import isAuth from '../middlewares/authMiddleware.js';
import { UnauthorizedError } from '../errors/customErrors.js';
import BetterDate from '../utils/betterdate.js';
import util from '../utils/helperFns.js'

const router = express.Router(); 


/**
 *  -------- GET ROUTER --------
 */

router.get('/chats', isAuth, async (req, res) => {
    if(req.user){
        const allUsers = await prisma.user.findMany({
            where: {
                NOT: {
                    id: req.user.id
                }
            }, 
            select: {
                id: true, 
                username: true
            }
        })
        const ids = util.extractIds(allUsers)
        ids.forEach(async id=> {
            const existingChat = await prisma.chat.findFirst({
                where: {
                    members: {
                        hasEvery: [id, req.user?.id]
                    }
                }
            })
            if(!existingChat) {
                const newChat = await prisma.chat.create({
                    data: {
                        members: [id, req.user?.id]
                    }
                })
            }
        })
        const existingChats = await prisma.chat.findMany({
            where:{
                members:{
                    has: req.user?.id
                }, 
                NOT: {
                    messages: {
                        none: {}
                    }
                }
            }, 
            include: {
                messages: true
            }
        })
        const contacts = existingChats.map(chat => {
            const recipient = allUsers.find(user => {
                return chat.members.includes(user.id)
            })
            return {
                chat: chat, 
                recipient: recipient
            }
        })
        console.log("Contacts:")
        console.log(contacts)
        res.json(contacts)

    } else {
        throw new UnauthorizedError()
    }
})

router.get('/chats/contacts', isAuth, async (req, res) => {
    if(req.user){
        const chats = await prisma.chat.findMany()
        const allUsers = await prisma.user.findMany({
            where: {
                NOT:{
                    id: req.user.id
                }
            }, 
            select: {
                id: true, 
                username: true, 
                displayPictureUrl: true
            }
        })
        const contacts = allUsers.map(user => {
            const chat = chats.find(chat => {
                return chat.members.includes(user.id) && chat.members.includes(req.user.id)
            })
            return {
                chatId: chat?.id, 
                username: user.username, 
                displayPictureUrl: user.displayPictureUrl
            }
        })
        res.json(contacts)

    } else {
        throw new UnauthorizedError()
    }
})

router.get('/chats/:chatId', isAuth, async (req, res) => {
    if(req.user) {
        const { chatId } = req.params; 
        const chat = await prisma.chat.findUnique({
            where:{
                id: String(chatId)
            }, 
            include: {
                messages: true
            }
        })
        if(chat){
            const recipientId = chat.members.find(element => element != req.user?.id)
            if(recipientId){
                const recipient = await prisma.user.findUnique({
                    where:{
                        id: recipientId
                    }
                })
                const responseObj = {
                    recipient, 
                    chat
                }
                console.log(responseObj)
                res.json(responseObj)
            }
        }

    } else {
        throw new UnauthorizedError()
    }
})

/**
 *  -------- POST ROUTER --------
 */

router.post('/chats/message/new', isAuth, async (req, res) => {
    if(req.user) {
        const { message } = req.body; 
        const { chatId } = req.body;

        const newMessage = await prisma.message.create({
            data: {
                authorId: req.user.id, 
                content: message, 
                timeSent: new BetterDate().now(),
                chatId
            }
        })

        res.json(newMessage)

    } else {
        throw new UnauthorizedError()
    }
})

export default router