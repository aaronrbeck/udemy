import { Prisma } from 'prisma-binding'
import { Binding } from 'graphql-binding';

//build a constructor function with new operator
//takes a single objects argument
const prisma = new Prisma({
//options argument must provide:
//typedefs, not datamodel, typedefs
//install graphql-cli
typeDefs:'src/generated/prisma.graphql',
    //and endpoint as string
endpoint: 'http://localhost:4466'
})

//4 key properties on the prisma object:
//prisma.query, prisma.mutation, prisma.subscription,
//prisma.exists

//prisma.query - how to fetch data within nodejs
//method name matches query name, in this case, users
//all prisma methods take 2 arguments: operation arguments, and selection set
//for users operation arguments are optional so pass in null
// prisma.query.users(null, '{ id name posts{ id title } }')
//the above returns a promise so you must wait or catch
// .then((data)=>{
    //changing 
//console.log(data)
//to
// console.log(JSON.stringify(data, undefined, 4))
//allows us to return js info to console, the 4 is space indents on returned info
//this makes data much more readable in console
// })
//so prisma binding allows us to do graphql actions inside node/our app

// challenge: fetch comments using prisma Binding
// 1.use comments query to fetch comments
//     grab comment id and text, grab comment aiuthor and name
// 2. test your work by viewing return in terminal output
 
//ok, so one thing I didn't understand was that just like a schema or resolver page you can
//have multiple actions happen here on the same page.  I commented out what we did before
//and added the wrong format here:

// prisma.query.users(null, '{ id name comments{ id author { name } text } }')
// .then((data)=>{
// console.log(JSON.stringify(data, undefined, 4))
// })
//here is the correct format:
// prisma.query.comments(null, '{id text author { id name }}').then((data)=>{
//     console.log(JSON.stringify(data, undefined, 2))
// })


// this time we will need to pass in an argument, just like we do in the playground
// prisma.mutation.createPost({
//     data:{
//         title: "gql101",
//         body: "empty",
//         published: false,
//         author:{
//             connect: {
//                 id: "cjuyh7rxp00aa0706o09t2rl4"
//             }
//         }

//     }
// }, '{ id title body published }').then((data)=>{
//     console.log(data)
//     prisma.query.users(null, '{ id name posts { id title }}')
// }).then((data)=>{
//     console.log(JSON.stringify(data, undefined, 2))
// })

// goal: mess with Mutations 
// 1 update newly created post changing body and marking as published
// 2 fetch all posts (id, title, body, published) and print to console
// 3. view the list of posts and confirm that post did have it body and published values

prisma.mutation.updatePost({
    //not sure if it matters, but I listed data then where
    //instructure went with - nope that didn't fix my mutation
    //nevertheless:
    where:{
        id: "cjuzqxtox00yi0706ymzpx7dd"
    },

    data:{
        body: "updated body2",
        published: true
    }
    // where:{
    //     id: "cjuyh7rxp00aa0706o09t2rl4"
    // }
}, '{id}').then((data)=>{
    //console.log(data) - instructor did not do this line
    return prisma.query.posts(null, '{ id title body published }')
}).then((data)=>{
    // console.log(JSON.stringify(data, undefined, 2))
    console.log(data)
})
//ok it looks like maybe I had structured everthing corectly but maybe i fed in a bad post id
//at one point I did have an unhandled promise, which I fixed by closing a }
//the mutation is working but for some reason the chained query is not working
//ok, tracked down why the query was not working:
//missing a return statement at:      return prisma.query.posts(null, '{ id title body published }')
