import express from 'express'; 
import { prisma } from '../../lib/prisma.js'; 
import BetterDate from '../utils/betterdate.js';
import isAuth from '../middlewares/authMiddleware.js';
import { NotFoundError, UnauthorizedError, ValidationError } from '../errors/customErrors.js';
import multer from 'multer'
import path from 'path'
import { createClient } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';

const router = express.Router(); 


/** --------- GET ROUTES --------
 * 
 */

router.get('/posts', isAuth, async (req, res) => {
    const allPosts = await prisma.post.findMany({
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
            id: 'desc'
        }
    }); 
    
    res.json(allPosts)
})

router.get('/posts/:id', isAuth, async (req, res) => {
    const post = await prisma.post.findUnique({
        where: {
            id: Number(req.params.id)
        }, 
        include: {
            author: true, 
            replies: {
                include: {
                    author: true, 
                    likedBy: {
                        select: {
                            likedById: true
                        }
                    }
                }
            }, 
            likedBy: {
                select: {
                    likedById: true
                }
            }
        }, 
    })
    if(!post) {
        throw new NotFoundError()
    }
    res.json(post)

})

router.post('/posts/:postId/like', isAuth, async (req, res) => {
    if(req.user) {
        const { postId } = req.params

        const like = await prisma.postLikes.create({
            data: {
                postId: Number(postId), 
                likedById: req.user.id
            }
        })

        res.sendStatus(200); 
    }
})

router.post('/posts/:postId/unlike', isAuth, async (req, res) => {
    if(req.user) {
        const { postId } = req.params
    const url = 'http://localhost:3000/posts/new'; 

        const like = await prisma.postLikes.delete({
            where: {
                postLikeId: {
                    likedById: req.user.id, 
                    postId: Number(postId)
                }
            }
        })
 
        res.sendStatus(200); 
    }
})

/** --------- POST ROUTES --------
 * 
 */

router.post('/posts/new', isAuth, async (req, res) => {
    if(req.user){
        const { content, attachmentURL, gifId } = req.body;
        const newPost = await prisma.post.create({
            data: {
                content, 
                postDate: new BetterDate().now(), 
                authorId: req.user?.id, 
                attachmentURL, 
                gifId
            }
        })
        if(!newPost) {
            throw new ValidationError()
        }
        res.json(newPost); 
        // res.sendStatus(200) 
    } else {
        throw new UnauthorizedError(); 
    }
});

const storage = multer.memoryStorage()

const upload = multer({storage: storage})

const supabase = createClient('https://jxbrbsjyqavjxdpcgbnm.supabase.co', 'sb_publishable_4-rgYIeJJkj4srQZtgUTdg_xA-AGyiZ');

router.post('/posts/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.sendStatus(400);
    }

    const fileBuffer = req.file.buffer; 
    const arrayBuffer = decode(fileBuffer.toString('base64')); 
    const fileName = `attachments/${Date.now()}-${req.file.originalname}`; 

    const { error } = await supabase
    .storage.from('uploads')
    .upload(fileName, arrayBuffer, {
      cacheControl: '3600',
      upsert: false,
      contentType: req.file.mimetype,
    });

    if (error) {
        console.log(error)
        return res.sendStatus(500);
    }

    const { data } = supabase
    .storage
    .from('uploads')
    .getPublicUrl(fileName); 

    res.json({ url: data.publicUrl })
})

export default router
    