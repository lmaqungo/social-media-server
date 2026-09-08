import express from 'express'
import  { prisma } from '../lib/prisma.js'
import isAuth from '../middlewares/authMiddleware.js'


const router = express.Router(); 

/** ---------- GET ROUTES ---------
 * 
 */

router.get('/search', isAuth, async (req, res) => {
    const {
        query, 
        filter
     } = req.query

     const processSearchQuery = (query) => {
        if (String(query).split(" ").length > 1){
            return String(query).trim().split(" ").join(" & ")
        } else return String(query)
     }

     if(query){
         const searchPosts = await prisma.post.findMany({
            where: {
                content: {
                    search: processSearchQuery(query)
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
        })
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
})

export default router