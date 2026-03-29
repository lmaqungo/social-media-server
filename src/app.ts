import express from 'express'; 
import cors from 'cors'
import passport from './config/passport.js'
import errorHandler from './middlewares/errorHandling.js';
import sessionStore from './config/sessionStore.js'

import authRouter from './routers/authRouter.js'
import postRouter from './routers/postsRouter.js'
import repliesRouter from './routers/repliesRouter.js'
import usersRouter from './routers/usersRouter.js'
import chatRouter from './routers/chatRouter.js'
import searchRouter from './routers/searchRouter.js'
import { origin } from './utils/loadEnvVars.js';

const app = express()

app.use(cors({
    credentials: true,
    origin: origin, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
    
}))
app.use(express.urlencoded({ extended: true }))

app.use(express.json())

app.set('trust proxy', 1)

app.use(sessionStore)
app.use(passport.initialize())
app.use(passport.session())


app.use('/', authRouter); 
app.use('/', postRouter); 
app.use('/', repliesRouter); 
app.use('/', usersRouter); 
app.use('/', chatRouter); 
app.use('/', searchRouter); 

app.use(errorHandler)

app.listen(3000, () => {
    console.log('Server listening on port 3000')
})