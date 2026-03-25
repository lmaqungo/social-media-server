import { faker } from '@faker-js/faker'; 
import BetterDate from './betterdate.js';
import { prisma } from '../lib/prisma.js';
import utils from './helperFns.js'

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

function seedPosts() {
    console.log('seeding posts...'); 
    utils.extractIds(users).forEach(userId => {
        for(let i = 0; i < 3; i++) {
            newPost({content: createRandomPost(), authorId: userId, postDate: new BetterDate({dateString: faker.date.anytime().toString()}).now()})
        }
    })
}


