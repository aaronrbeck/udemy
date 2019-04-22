import { METHODS } from "http";

// for every  subscription we set up a new property
// the property name needs to match the subscription name
// the property is not a METHOD, the property is an object with 
// a method
// you do not return like a regular resolver, a regular resolver
//will return whatever your destination type is as defined in your schema
//for subscriptions you will return this pubsub thing which we 
//imported on index.js from graphql-yoga and brought into here
//via destructuring the context as seen below:
const Subscription = {
    count: {
        subscribe(parent , args, { pubsub }, info) {
            let count = 0
            setInterval(() =>{
                count++
                pubsub.publish('count', {
                    count

                })
            }, 1000)
            // in return pubsub.asyncIterator('count'), count is callled the channel name
            //channel names do not have a standard nameing convention, invent your own and
            //stick with it 
            return pubsub.asyncIterator('count')
        }
    },
    
    comment: {
        subscribe( parnt, { postId }, { db, pubsub }, info ) {
            const post = db.posts.find((post) => post.id === postId && post.published)
            if (!post) {
                throw new Error('Post not found')

            }

            return pubsub.asyncIterator(`comment ${postId}`)
            //comments get created in the mutation file on the
            //createComments mutation, so that is where 
            //pubsub.publish needs to get called

        }
    }
    
}
 export { Subscription as default }