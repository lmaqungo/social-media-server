import dotenv from 'dotenv'
dotenv.config({ quiet: true })

const { NODE_ENV, LOCAL_DB_URL, REMOTE_DB_URL, LOCAL_ORIGIN, 
REMOTE_ORIGIN, GOOGLE_CLIENT_ID, 
GOOGLE_CLIENT_SECRET } = process.env;

function getDbUrl() {
    switch(NODE_ENV) {
        case 'dev': 
            return LOCAL_DB_URL; 
        case 'prod': 
            return REMOTE_DB_URL; 
    }; 
}

function getClientOrigin(){
    switch(NODE_ENV) {
        case 'dev':
            return LOCAL_ORIGIN;
        case 'prod':
            return REMOTE_ORIGIN;
    }
}

const dbURL = getDbUrl();
const origin = getClientOrigin();
const clientID = GOOGLE_CLIENT_ID; 
const clientSecret = GOOGLE_CLIENT_SECRET; 

export { dbURL, origin, clientID, clientSecret };