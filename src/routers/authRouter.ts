import express from 'express'; 
import passport from '../config/passport.js'; 

const router = express.Router(); 

router.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile'] })
); 

router.get('/auth/guest',
    passport.authenticate('guest', { failureRedirect: 'http://localhost:5173/login' }), 
    (req, res) => {
        res.redirect('http://localhost:5173')
    }
)

router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect:'http://localhost:5173/login' }), 
    (req, res) => {
        res.redirect('http://localhost:5173')
    }
)

router.post('/auth/logout', (req, res, next) => {
    console.log('route is reached')
    req.logout(function(err) { if (err) { return next(err); } res.sendStatus(200); })
    }
)

export default router