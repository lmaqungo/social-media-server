import express from 'express'
import  { prisma } from '../lib/prisma.js'
import isAuth from '../middlewares/authMiddleware.js'
import { NotFoundError, UnauthorizedError, ValidationError } from '../errors/customErrors.js'


const router = express.Router(); 

/** ---------- GET ROUTES ---------
 * 
 */

router.get('/search', isAuth, async (req, res) => {
    const {
        query, 
        filter
     } = req.query

     if(req.user){
         if(query){
             const searchPosts = await prisma.post.findMany({
                where: {
                    content: {
                        search: String(query)
                    }
                },
                include: {
                    author: true, 
                    replies: true, 
                    likedBy: {
                        select:{
                            likedById: true
                        }
                    }
        
                }, 
                orderBy: {
                    id: 'asc'
                }
            });
            const searchUsers = await prisma.user.findMany({
                where:{
                    NOT: {
                        id: req.user.id
                    }, 
                    username: {
                        contains: String(query)
                    }
                }, 
                orderBy: {
                    id: 'asc'
                }
            })
            
            if(['undefined', 'posts'].includes(String(filter))){
                res.json(searchPosts)
            } else if(String(filter) === 'people') {
                res.json(searchUsers)
            }
        }
     }
})

export default router