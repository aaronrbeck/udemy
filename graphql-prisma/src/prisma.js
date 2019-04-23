import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466/'
})

// prisma.query, prisma.mutation prisma.subscription, prisma.exists


//prisma.query is an object with a set of available methods
//there is one method for every query
//the method name matches the query name as seen in the playground schema
//all prisma methods take two arguments: operations arguments, selection set
//sends back a promise, so .then execute a callback function
prisma.query.users(null, '{ id name email }').then(()=>{
    console.log(data)
})