import { faker } from '@faker-js/faker'; 
import BetterDate from './betterdate.js';
import { prisma } from '../lib/prisma.js';

function createRandomUser() {
    return {
        username: faker.internet.username(), 
        dateJoined: faker.date.anytime()
    }
}

function createRandomPost() {
    return faker.lorem.paragraph({min: 5, max: 10})
}

async function seedUsers(count: number) {
    console.log('seeding users ...')
    for(let i = 0; i < count; i++) {
        const randomUser = createRandomUser(); 
        const newUser = await prisma.user.create({
            data: {
                username: randomUser.username, 
                dateJoined: new BetterDate({dateString: randomUser.dateJoined.toString()}).now(),
            },
        })
    }
    console.log('Done!')
}

const users = await prisma.user.findMany({
    select: {
        id: true
    }
})

async function newPost({content, authorId, postDate}) {
    const newPost = await prisma.post.create({
        data: {
            content, 
            authorId, 
            postDate
        }
    })
}

async function clearPosts(){ 
    console.log('deleting all posts...')
    await prisma.postLikes.deleteMany({})
    await prisma.post.deleteMany({})
    console.log('done')
}

async function seedPosts() {
    console.log('seeding posts...'); 
    const posts = [
        {
            content: " i think about how every person walking past me has an entire universe inside them — inside jokes with their sister, a song that makes them cry, a recipe from their grandma they make when they miss home. we're all just walking around carrying whole worlds and most of the time we don't even say hi to each other. anyway i said good morning to a stranger today and they smiled really big and i thought about it for the rest of the day", 
            gifId: ''
        } ,
        {
            content: 'you are so deeply loved by people who have never even met you yet', 
            gifId: 'C9CoWYJBtw3uw5ofCb'
        }, 
        { 
            content: `unpopular opinion: "authenticity" as a personality trait is a paradox. the moment you're performing authenticity for an audience it stops being authentic. we're all just curating a self and calling it truth. discuss.
            
            the modern condition is being fluent in the language of self-improvement while structurally incapable of rest. we've turned healing into a productivity metric and nobody's stopped to ask why.`, 
            gifId: ''
        }
    ]
    let postIndex = 0
    for (const authorId of [8, 7, 4]){

        await prisma.post.create({
            data: {
                content: posts[postIndex].content, 
                authorId, 
                gifId: posts[postIndex].gifId.length > 0 ? posts[postIndex].gifId : null, 
                postDate: new BetterDate({dateString: faker.date.anytime().toString()}).now()
            }
        })
        postIndex+=1
    }
    
}






