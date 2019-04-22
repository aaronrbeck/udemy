
// Goal:mutation: updating a post
// 1. Define Mutation
// - add id/data for arguments.  Setup data to support title, body, and published
// - return updated post
// 2. create resolver METHOD 
// - verify post exists, else throw error
// - update post properties on at a Time 
// 3.  verify work by updating all properties for a given post

// Goal:mutation: updating a comment
// 1. Define Mutation
// - add id/data for arguments.  Setup data to support text
// - return updated comment
// 2. create resolver METHOD 
// - verify comment exists, else throw error
// - update comment properties on at a Time 
// 3.  verify work by updating all properties for a given post



import uuidv4 from 'uuid/v4'
import { METHODS } from 'http';
import { exists } from 'fs';

const Mutation = {
    createUser(parent, args, { db }, info) {
        const emailTaken = db.users.some((user) => user.email === args.email)

        if (emailTaken) {
            throw new Error('Email taken')
        }


        // example npm install babel - plugin - transorm - object - rest - spread
        // see notes page for reminder
        // const one = {
        //     name: 'Philidelphia',
        //     country: 'USA'

        // }
        // const two = {
        //     population: 15000000
        //     ...one
        // }

        //manual, no babel spread plugin below:
        const user = {
            id: uuidv4(),
            name: args.name,
            email: args.email,
            age: args.age
        }

        db.users.push(user)

        return user
    },

    deleteUser(parent, args, { db }, info){
        const userIndex = db.users.findIndex((user) => user.id === args.id)

        if (userIndex === -1) {
            throw new Error('No user found')
        }

        const deletedUsers = db.users.splice(userIndex, 1)



            //remove all associated posts and all associated comments:
            ``
        db.posts = db.posts.filter((post) => {
            const match = post.author === args.id
            if (match) {
                db.comments = db.comments.filter((comment) => comment.post !== post.id)
            }

            return !match

        })

        //remove all comments this user created

        db.comments = db.comments.filter((comment) => comment.author !== args.id)

        return deletedUsers[0]



    },

    updateUser(parent, args, { db }, info){
        //when I added upDate user I failed to include
        const { id, data } = args
        //which meant that id had never been defined and while the file compiled
        //when I ran the updateUswer mutation, the query failed and I got back:
        // {
        //     "data": null,
        //         "errors": [
        //             {
        //                 "message": "Cannot read property 'id' of undefined",
        // things are still not resolved
        //Unfortunatly I was not adble to track this down on my own
        //I found the error by doing a line by line comparison to instructor files
        //so, how do I get to the point where I track this stuff down on my own?
        //another mistake I made was user => db.user.id in the call back function
        //the db should not be inside the call back function
        //solved
        const user = db.users.find((user => user.id === id))
        if (!user){
            throw new Error ('User not found')
        }
        if (typeof data.email === "string"){
            const emailTaken = db.users.some((user)=> user.email === data.email)
            if (emailTaken){
                throw new Error('Email Taken')
            }
            user.email = data.email
        }

        if (typeof data.name === 'string'){
            user.name = data.name
        }
        
        if (typeof data.age !== 'undefined'){
            user.age = data.age
        }
return user
    },


    createPost(parent, args, { db }, info){
        const userExists = db.users.some((user) => user.id === args.data.author)

        if (!userExists) {
            throw new Error('User not found')
        }
        //using the babel spread plugin below:
        const post = {
            id: uuidv4(),
            ...args.data
        }
        db.posts.push(post)
        return post
    },

    // 2. define resolver for the mutation
    //     - check if posts exists, else throw error
    //     -remove and return post
    //     - remove all comments belonging to that post
    deletePost(parent, args, { db }, info){
        const postIndex = db.posts.findIndex((post) => post.id === args.id)
        if (postIndex === -1) {
            throw new Error('post not found')
        }
        const deletedPosts = db.posts.splice(postIndex, 1)


        //I tried including the following if statement? Why? I thought this was resetting 
        //our posts array and doing the actual deleting.  Instructor did not include this.
        //what would it actually do? My mistake was trying to copy steps from the delete
        //user down into the deletePosts step, above this if statement was needed to find
        //posts that were created by a now deletedUser - so a case of blind hoop jumping I guess
        // posts = posts.filter((post) => {
        //     const match = post.id === args.id
        //     if (match) {
        //         posts = posts.filter((post) => args.id !== post.id)
        //     }

        //     return !match

        // })



        //remove all comments this user created

        db.comments = db.comments.filter((comment) => comment.post !== args.id)


        //I did fail to include [0] in the following line which defines an 
        //array for the deletedPosts to land in
        return deletedPosts[0]

    },

    updatePost(parent, args, { db }, info){
        const { id, data } = args
        const post = db.posts.find((post => post.id === id))
        if (!post) {
            throw new Error('Post not found')
        }
        // - add id/data for arguments.  Setup data to support title, body, and published
        // - return updated post

        if (typeof data.title === 'string'){
            post.title = data.title
        }

        if (typeof data.body === 'string'){
            post.body = data.body
        }
            
        if (typeof data.published === 'boolean') {
            post.published = data.published
        }

         
        
        return post
    },

    createComment(parent, args, { db }, info){
        const userExists = db.users.some((user) => user.id === args.data.author)
        const postExists = db.posts.some((post) => post.id === args.data.post && post.published)
        if (!userExists || !postExists) {
            throw new Error('Did not find user and post')
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        }
        db.comments.push(comment)
        return comment
    },
    // 2. define resolver for the mutation
    //     - check if comment exists, else throw error 
    //     - remove and return the comment
    deleteComment(parent, args, { db }, info){
        const commentIndex = db.comments.findIndex((comment) => comment.id === args.id)
        if (commentIndex === -1) {
            throw new Error('comment not found')
        }
        const deletedComment = db.comments.splice(postIndex, 1)


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

    updateComment(parent, args, { db }, info) {
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

        return comment
    },

}

export {Mutation as default}