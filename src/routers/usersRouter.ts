import express from 'express'; 
import { prisma } from '../lib/prisma.js'; 
import isAuth from '../middlewares/authMiddleware.js';
import { NotFoundError, UnauthorizedError, ValidationError } from '../errors/customErrors.js';
import utils from '../utils/helperFns.js'



const router = express.Router(); 

/** --------- GET ROUTES --------
 * 
 */

router.get('/users/loggedUser', isAuth, async(req, res) => {
    if(req.user) {
        const loggedUser = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }, 
            include: {
                following: {
                    select: {
                        followingId: true
                        }
                    }, 
                followedBy: {
                    select: {
                        followedById: true
                    }
                }, 
                posts: {
                    include: {
                        author:true, 
                        replies: true, 
                        likedBy: {
                            select: {
                                likedById: true
                            }
                        }
                    }, 
                    orderBy: {
                        id: 'desc'
                    }
                }
            }
        })

        res.json(loggedUser)
    }
})

router.get('/users/:userId', isAuth, async (req, res) => {
    const { userId } = req.params; 

    const user = await prisma.user.findUnique({
        where: {
            id: Number(userId)
        }, 
        include: {
            following: {
                select: {
                    followingId: true
                }
            }, 
            followedBy: {
                select: {
                    followedById: true
                }
            }, 
            posts: {
                include: {
                    author:true, 
                    replies: true, 
                    likedBy: {
                        select: {
                            likedById: true
                        }
                    }
                }, 
                orderBy: {
                    id: 'desc'
                }
            }
        }
    })

    res.json(user)

})

router.post('/users/:userId/follow', isAuth, async (req, res) => {
    if(req.user) {
        const { userId } = req.params; 

        const follow = await prisma.follows.create({
            data: {
                followedById:  req.user.id, 
                followingId: Number(userId), 
            }
        }); 
        const loggedUser = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }, 
            include: {
                following: {
                    select: {
                        followingId: true
                    }
                }
            }

        }); 
        
        res.sendStatus(200); 
    }
}); 

router.delete('/users/:userId/unfollow', isAuth, async (req, res) => {
    if(req.user) {
        const { userId } = req.params; 

        const followRecord = await prisma.follows.findUnique({
            where: {
                followId: {
                    followedById:  req.user.id, 
                    followingId: Number(userId), 
                }
            }
        })
        
        if(followRecord){
            const follow = await prisma.follows.delete({
                where: {
                    followId: {
                        followedById:  req.user.id, 
                        followingId: Number(userId), 
                    }
                }
            }); 
        }

        res.sendStatus(200); 
    }
}); 

router.put('/users/:userId/update', isAuth, async (req, res) => {
    if(req.user) {
        const { bio, website } = req.body
        const updatedUser = await prisma.user.update({
            where: {
                id: req.user.id
            }, 
            data: {
                bio, 
                website
            }
        })
        res.sendStatus(200)
    }
})

export default router