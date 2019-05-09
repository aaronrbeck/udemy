
const Query = {
    users(parent, args, { prisma }, info) {
        //create objects to pass in to the query operataions argument
        const opArgs = {}
                //set up conditional statement for when args exists indicating that
                //we should use those args in opArgs
                if(args.query){
                    opArgs.where = {
    //  refer to schema to see supported args, such as name_contains
                        name_contains: args.query
                    }
                }
      


        //to fetch all users out of the database, use prisma.query
        //2 arguments, operation arguments (null in first lesson), selection set ( nothing, string, or object)
        //nothing: problematic as you can not work with relational types
        //string: this is how we did it before: '{ author {id name}}' - only works if we know what we need
        //object: advantage is user can define this object via the info object
        //although we have a promise, resolver methods can take promises, there for just return:

        return prisma.query.users(null, info)
        
        
        // if (!args.query) {
        //     return db.users
        // }

        // return db.users.filter((user) => {
        //     return user.name.toLowerCase().includes(args.query.toLowerCase())
        // })
    },

    // challenge: Modify posts query to return posts from the database
    // 1.comment out existing code
    // 2. use correct prisma method
    //     - ignore operations arguements for now 
    // 3. Run the posts query on the Node.js gql api to verify that it hits the database
    //     - just ask for scalar fields




    posts(parent, args, { prisma }, info) {
    //     if (!args.query) {
    //         return db.posts
    //     }

    //     return db.posts.filter((post) => {
    //         const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
    //         const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
    //         return isTitleMatch || isBodyMatch
    //     })
 

    return prisma.query.posts(null, info)

   },

    comments(parent, args, { db }, info) {
        return db.comments
    },
    me() {
        return {
            id: '123098',
            name: 'Mike',
            email: 'mike@example.com'
        }
    },
    post() {
        return {
            id: '092',
            title: 'GraphQL 101',
            body: '',
            published: false
        }
    }
}

export { Query as default }