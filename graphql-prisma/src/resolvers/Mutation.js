

import uuidv4 from 'uuid/v4'


//because we are using prisma, our functions need to be async (we are reaching 'outside'?)
//and because we are using an async function we await the initial constant that we define

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        const emailTaken = await prisma.exists.User({ email: args.data.email })
        if (emailTaken){
            throw new Error('Email taken')
        }

        return prisma.mutation.createUser({ data: args.data}, info )
    },

    async deleteUser(parent, args, { prisma }, info){
        //we manualy check to see if the user exists:
        const userExists = await prisma.exists.User({ id: args.id })

        if (!userExists){
            throw new Error('User not found')
        }
        //so prisma.mutation.deleteUser() is something provided by prisma, but how did I know that
        //is something prisma defines, in other words, how do I discover what 
        //prisma allows me to do as far as CRUD stuff for next time?  Where do I find these definitions?
        //I guess I could find the .deleteUser via the playground?
        return prisma.mutation.deleteUser({ 
            where:{
                id: args.id
            }
         }, info)





    },

    async updateUser(parent, args, { prisma }, info){
         //this time instead of doing the manual check upfront we let prisma do the checking to see if a user exists:
         return prisma.mutation.updateUser({
             where:{
                 id: args.id
             },
             //I watched it a couple times, but I still am not able to follow everrything
             //the instructor shares about the value data
             //watch again at some point?
             data: args.data
         }, info)
        
    },


    async createPost(parent, args, { prisma }, info){
        return prisma.mutation.createPost({
        data:{
            title: args.data.title,
            body: args.data.body,
            published: args.data.published,
            author: {
                connect: {
                    id: args.data.author
                }
            }

        }
    }, info)
},
        
    deletePost(parent, args, { prisma }, info){
        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }

        }, info)

    },

    updatePost(parent, args, { prisma }, info){

        return prisma.mutation.updatePost({
            where:{
                id: args.id
            },
            data: args.data
            //i tried to line item the data points below,
            //turns out all that data is actually allready in 'data' (I'm not sure how)
            //so the instructor just assigned args.data.  How would I have known that on my own?
            //I built the following object based on the structure I read in the playground - it seemed to have
            //worked when I tested it, but not nearly as nice as the instructor's approach
            // {
            //     title: args.data.title,
            //     body: args.data.body,
            //     published: args.data.published
            // }

        }, info)
    },

    createComment(parent, args, { db, pubsub }, info){
        const userExists = db.users.some((user) => user.id === args.data.author)
        const postExists = db.posts.some((post) => post.id === args.data.post && post.published)
        if (!userExists || !postExists) {
            throw new Error('Did not find user and post')
        }
// update published call in createComment to send back CREATED  with the data
        const comment = {
            id: uuidv4(),
            ...args.data
        }
        db.comments.push(comment)

        //because we have a subscription for comments, and comments
        //get created here in createComment, we need to call pubsub.publish
        //here providing two arguements inside a template literal string:
        //the channel name, and the actual data 

        

        pubsub.publish(`comment ${args.data.post}`, { comment: {
            mutation: 'CREATED',
            data: comment
        } })

        return comment
    },
    // 2. define resolver for the mutation
    //     - check if comment exists, else throw error 
    //     - remove and return the comment
    deleteComment(parent, args, { db, pubsub }, info){
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)
        if (commentIndex === -1) {
            throw new Error('comment not found')
        }
        const [deletedComment] = db.comments.splice(postIndex, 1)
        pubsub.publish(`comment ${deletedComment.post}`, { 
            comment: {
            mutation: 'DELETED',
            data: deletedComment
        }})
        return deletedComment[0]
    },
    // Goal:mutation: updating a comment
// 1. Define Mutation
// - add id/data for arguments.  Setup data to support text
// - return updated comment
// 2. create resolver METHOD 
// - verify comment exists, else throw error
// - update comment properties on at a Time 
// 3.  verify work by updating all properties for a given post
    updateComment(parent, args, { db, pubsub }, info) {
        const { id, data } = args
        const comment = db.comments.find((comment => comment.id === id))
        if (!comment) {
            throw new Error('comment not found')
        }
        // - add id/data for arguments.  Setup data to support title, body, and published
        // - return updated post
        if (typeof data.text === 'string') {
            comment.text = data.text
        }
        // add publish call in updateComment using UPDATED event
        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })
        return comment
    },

}

export {Mutation as default}





