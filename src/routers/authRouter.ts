import express from 'express'; 
import passport from '../config/passport.js'; 
import { origin } from '../utils/loadEnvVars.js';

const router = express.Router(); 
const failureRedirect = `${origin}/login`

router.get('/auth/google', 
    passport.authenticate('google', { scope: ['profile'] })
); 

router.get('/auth/guest',
    passport.authenticate('guest', { failureRedirect }), 
    (req, res) => {
        if(req.isAuthenticated()){
            res.redirect(origin)
        }
    }
)

router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect }), 
    (req, res) => {
        res.redirect(origin)
    }
)

router.post('/auth/logout', (req, res, next) => {
    req.logout(function(err) { if (err) { return next(err); } res.sendStatus(200); })
    }
)

export default router