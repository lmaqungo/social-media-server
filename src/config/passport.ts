import passport, { type Profile } from 'passport'
import { Strategy as GoogleStrategy, type VerifyCallback} from 'passport-google-oauth20'
import { prisma } from '../lib/prisma.js';
import BetterDate from '../utils/betterdate.js';
import { Strategy as CustomStrategy } from 'passport-custom'; 
import { clientID, clientSecret } from '../utils/loadEnvVars.js'; 
import { origin } from '../utils/loadEnvVars.js';

const oAuthVerifyCallback = async function(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
    try{ 
        
        // first check if user exists before creating a new record
        const searchUser = await prisma.user.findUnique({
            where: {
                username: profile.displayName
            }
        }); 

        if(searchUser?.username === profile.displayName) {
            return done(null, searchUser)

        } else {
            let userData; 

            if(profile.photos){
                if(profile.photos.length> 0){
                    userData = {
                        username: profile.displayName, 
                        dateJoined: new BetterDate().now(), 
                        displayPictureUrl: profile.photos[0]?.value
                    }
                } else{
                    userData = {
                        username: profile.displayName, 
                        dateJoined: new BetterDate().now(), 
                    }
                }
            } else {
                userData = {
                        username: profile.displayName, 
                        dateJoined: new BetterDate().now(), 
                }
            }

            const newUser = await prisma.user.create({
                data: {
                    username: userData.username, 
                    dateJoined: userData.dateJoined, 
                    displayPictureUrl: userData.displayPictureUrl || null
                }
            })
            return done(null, newUser)
        }

    } catch (err) {
        return done(err)
    }
}

const guestVerifyCallback = async function(req, done: VerifyCallback) {
    try {
        //first check if guest user exists
        const guestUser = await prisma.user.findUnique({
            where: {
                username: 'brainrot-guest'
            }
        })

        if(guestUser){
            return done(null, guestUser)
        } else {
            const guestAccount = await prisma.user.create({
                data: {
                    username: 'brainrot-guest', 
                    dateJoined: new BetterDate().now()
                }
            })
            return done(null, guestAccount)
        }

    } catch (err) {
        return done(err)
    }
}

const googleStrategy = new GoogleStrategy({
    clientID: clientID || "error: no id" , 
    clientSecret: clientSecret || "error: no secret", 
    callbackURL: `${origin}/auth/google/callback`
    }, oAuthVerifyCallback
)

const guestStrategy = new CustomStrategy(
    guestVerifyCallback
)

passport.use(googleStrategy); 

passport.use('guest', guestStrategy )

passport.serializeUser((user, done) => {
    done(null, user.id); 
})

passport.deserializeUser( async (id, done) => {
    // console.log(`deserialized user: ${id}, type: ${typeof id}`)
    try{
        const user = await prisma.user.findUnique({
            where: {
                id: id as number
            }
        })
        done(null, user)
    } catch (err) {
        done(err)
    }
})

export default passport