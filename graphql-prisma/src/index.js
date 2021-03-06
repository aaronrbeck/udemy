import { GraphQLServer, PubSub } from 'graphql-yoga'


import db from './db'

import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Subscription from './resolvers/Subscription'
import Post from './resolvers/Post'
import Comment from './resolvers/Comment'
import prisma from './prisma'

//Resolvers


const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers: {
        Query,
        Mutation,
        Subscription,
        User,
        Post,
        Comment
    },
    context(request) {
        //console.log(request.request.headers)
        return{
        db,
        pubsub,
        //added in lesson 59, context becomes available in resolvers
        prisma,
        request
        }
    }
})

server.start(() => {
    console.log('The server is up!')
})