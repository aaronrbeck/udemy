const User = {
    //because prisma has support for relational data,
    //we can actually delete the following 2 methods that we set up for 
    //relational data back when we were just looking at our local database arrays
    // I'm not completely clear on how this works, but trying to wrap my head around it
    //what I don't understand is how to recognize a similar situation where all we have to have
    //is an empty object and prisma does the rest of the work
    // posts(parent, args, { db }, info) {
    //     return db.posts.filter((post) => {
    //         return post.author === parent.id
    //     })
    // },
    // comments(parent, args, { db }, info) {
    //     return db.comments.filter((comment) => {
    //         return comment.author === parent.id
    //     })
    // }
}

export { User as default }