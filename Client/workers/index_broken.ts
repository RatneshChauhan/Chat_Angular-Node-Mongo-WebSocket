//import posts from './post/data'
const User = require('../../../Server/src/models/user.model');

export async function onRequestGet() {

    const users = await User.find({ email: { $ne: 'edge@gmail.com' }, name: { $exists: true } }).sort({ 'name': 1 });

    console.log('users  : : ', users)
    return new Response('Hello Cloudflare Workers!');
    //return Response.json(posts)
}