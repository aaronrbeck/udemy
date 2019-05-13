const Post = {
        //because prisma has support for relational data,
    //we can actually delete the following 2 methods that we set up for 
    //relational data back when we were just looking at our local database arrays
    // I'm not completely clear on how this works, but trying to wrap my head around it
    //what I don't understand is how to recognize a similar situation where all we have to have
    //is an empty object and prisma does the rest of the work

    // author(parent, args, { db }, info) {
    //     return db.users.find((user) => {
    //         return user.id === parent.author
    //     })
    // },
    // comments(parent, args, { db }, info) {
    //     return db.comments.filter((comment) => {
    //         return comment.post === parent.id
    //     })
    // }
}
export { Post as default }