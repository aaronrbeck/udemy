

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../utilities/getUserId'

//take in password -> validate password -> hash password -> generate auth token


//create a new token and pass 2 arguments to it, a payload object and a secret



const Mutation = {
    async createUser(parent, args, { prisma }, info) {

        //validate that pw is at least 8 characters long
        if(args.data.password.length < 8 ){
            throw new Error('Password must be 8 characters or longer.')
        }

        //hash a plaintext pw using bcrypt:
        const password = await bcrypt.hash(args.data.password, 10)
        //the 2nd parameter (10) is a salt - random number of characters added to hash
        //hash returns a promise which resolves with the hashed value, so we await it and stick it in the const password

        const user = await prisma.mutation.createUser({ 
            data: {
                ...args.data,
                password
            }
            },)
            return{
                user,
                token:jwt.sign({userId: user.id}, 'thisisasecret')
            }
    },

    //I still don't understand when to use async - as a beginner, just always use it
    async login(parent, args, { prisma }, info){
        const user = await prisma.query.user({ 
            where:{
                email: args.data.email
            }})
        if (!user){
            throw new Error('Unable to login')
        }


            const isMatch = await bcrypt.compare(args.data.password, user.password)
            if(!isMatch){
                throw new Error('Unable to login')
            }
        return {
            user,
            token: jwt.sign({ userId: user.id }, 'thisisasecret')
        }


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


     createPost(parent, args, { prisma, request }, info){
        const userId = getUserId(request)
        //get header value, parse out the token, verify...
        return prisma.mutation.createPost({
        data:{
            title: args.data.title,
            body: args.data.body,
            published: args.data.published,
            author: {
                connect: {
                    id: userId
                }
            }

        }
    }, info)
},
        


//how come the above create mutations need to be async, but the below deletes and mutations do not need to be async
//aren't we "going outside" in any mutation?  as if it were any "fetch" call?
//I don't understand
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

    createComment(parent, args, { prisma }, info){
        return prisma.mutation.createComment({
            //I tried passing the args data, but apparently you have to be specific.  maybe creations need to be specific, but updates do not need to be specific?
            //data: data.args
            data:{
                text: args.data.text,
                author:{
                    connect:{
                        id: args.data.author
                    }
                },
                post:{
                    connect:{
                        id: args.data.post
                    }
                }
            }

        },info)
    },
    deleteComment(parent, args, { prisma }, info){
        return prisma.mutation.deleteComment({
                where:{
                    id: args.id
                }
        }, info)
    },
    updateComment(parent, args, { prisma }, info) {
    return prisma.mutation.updateComment({
        where:{
            id: args.id
        },
        data: args.data
    }, info)
    
    },

    

}

export {Mutation as default}





