import uuidv4 from 'uuid/v4'

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
    }


}

export {Mutation as default}