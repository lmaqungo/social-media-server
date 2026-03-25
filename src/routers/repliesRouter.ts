import express from 'express'; 
import { prisma } from '../lib/prisma.js'; 
import BetterDate from '../utils/betterdate.js';
import isAuth from '../middlewares/authMiddleware.js';
import { NotFoundError, UnauthorizedError, ValidationError } from '../errors/customErrors.js';

const router = express.Router(); 

/**
 *  -------- GET ROUTES ---------
 */

router.get('/replies/:postId', isAuth, async (req, res) => {
    const { postId } = req.params; 
    const replies = await prisma.reply.findMany({
        where: {
            originalPostId: Number(postId)
        }, 
        include: {
            author: true
        }, 
        orderBy: {
            id: 'asc'
        }
    }); 
    if(!replies) {
        throw new NotFoundError()
    }
    res.json(replies)
})

/**
 *  -------- POST ROUTES ---------
 */

router.post('/replies/:postId/new', isAuth, async (req, res) => {
    if (req.user) {
        const { reply } = req.body; 
        const { postId } = req.params; 
        const newReply = await prisma.reply.create({
            data: {
                content: reply, 
                authorId: req.user.id, 
                postDate: new BetterDate().now(), 
                originalPostId: Number(postId)
            }, 
            include: {
                author: true, 
                likedBy: {
                    select: {
                        likedById: true
                    }
                }
            }
        })
        if (!newReply) {
            throw new ValidationError(); 
        }
        res.json(newReply)
    } else {
        throw new UnauthorizedError(); 
    }
})

router.post('/replies/:replyId/like', isAuth, async (req, res) => {
    if(req.user) {
        const { replyId } = req.params

        const like = await prisma.replyLikes.create({
            data: {
                replyId: Number(replyId), 
                likedById: req.user.id
            }
        })

        res.sendStatus(200); 
    }
})

router.post('/replies/:replyId/unlike', isAuth, async (req, res) => {
    if(req.user) {
        const { replyId } = req.params

        const like = await prisma.replyLikes.delete({
            where: {
                replyLikeId: {
                    likedById: req.user.id, 
                    replyId: Number(replyId)
                }
            }
        })
 
        res.sendStatus(200); 
    }
})

export default router; 