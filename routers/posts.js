const router = require("express").Router()
const User = require("../models/User")
const Post = require("../models/Post")
const bcrypt = require("bcrypt")

const fs = require("fs");
const path = require("path")
const url = require("url");
const { v4 } = require("uuid");
const constants = require("../constant/general");


const PATH_POST = `public/post`
const PATH_USER = `public/user`


// create post :
router.post("/", async (req, res) => {
    try {
        const { userId } = req.body
        if (userId) {
            const user = await User.findOne({ _id: userId })
            if (user && user._id) {
                const newPost = new Post(req.body)
                const post = await newPost.save()

                await user.updateOne({ $push: { posts: post._id } })

                res.status(200).json(post)
            } else {
                res.status(400).send("bad request")
            }
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

// update post :
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id }, { userId: 1 })
        const { userId, ...update } = req.body
        const user = await User.findOne({ _id: userId }, { posts: 1 })
        if (post && user && user.posts.includes(req.params.id) && userId === post.userId) {
            await post.updateOne({ $set: update })
            const postUpdated = await Post.findOne({ _id: req.params.id })
            res.status(200).json(postUpdated)
        } else {
            return res.status(404).send("None user or post with this id")
        }
    } catch (err) {
        return res.status(500).json(err)
    }
})

// update post :
router.put("/:id/set_img", async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id }, { userId: 1, coverImg: 1 })

        !req.body.coverImg ? req.body.coverImg = "" : null

        const { userId, coverImg, set } = req.body
        const user = await User.findOne({ _id: userId }, { posts: 1 })
        if (post && user && user.posts.includes(req.params.id) && userId === post.userId) {
            if (set) {
                await post.updateOne({ $set: { coverImg: coverImg } })
            } else {
                await post.updateOne({ $set: { coverImg: post.coverImg + coverImg } })
            }
            const postUpdated = await Post.findOne({ _id: req.params.id })
            res.status(200).json(postUpdated)
        } else {
            return res.status(404).send("None user or post with this id")
        }
    } catch (err) {
        return res.status(500).json(err)
    }
})


// delete post : 
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id }, { userId: 1, coverImg: 1 })
        const { userId } = req.query
        console.log(req.query)
        const user = await User.findOne({ _id: userId }, { posts: 1 })
        if (post && user && user.posts.includes(req.params.id) && userId === post.userId) {

            if (post.coverImg && post.coverImg != "") {

                let pathStorePost = url.parse(post.coverImg).pathname

                if (pathStorePost.startsWith("/"))
                    pathStorePost = pathStorePost.slice(1, pathStorePost.length)

                if (fs.existsSync(pathStorePost))
                    fs.unlinkSync(pathStorePost)

            }

            await user.updateOne({ $unset: { posts: post._id } })
            await post.deleteOne()

            res.status(200).send("Post has been deleting")
        } else {
            return res.status(404).send("None user or post with this id")
        }
    } catch (err) {
        return res.status(500).json(err)
    }
})


// like / dislike a post :
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id }, { likes: 1 })
        const { userId } = req.body
        const user = await User.findOne({ _id: userId }, { posts_likes: 1 })

        if (post && user) {
            if (!post.likes.includes(userId)) {
                await post.updateOne({ $push: { likes: userId } })
                await user.updateOne({ $push: { posts_likes: req.params.id } })
                res.status(200).send("Post has been adding like")
            } else {
                await post.updateOne({ $pull: { likes: userId } })
                await user.updateOne({ $pull: { posts_likes: req.params.id } })
                res.status(200).send("Post has been removing like")
            }
        } else {
            return res.status(404).send("None user or post with this id")
        }
    } catch (err) {
        return res.status(500).json(err)
    }
})


// add comment for post :
router.put("/:id/comment", async (req, res) => {
    try {
        const { id } = req.params
        const { userId, text } = req.body
        const post = await Post.findOne({ _id: id }, { comments: 1 })
        const user = await User.findOne({ _id: userId }, { posts_likes: 1 })

        if (post._id && user._id) {

            let commentCount = 0
            post.comments.forEach(c => {
                if (c.userId == userId) {
                    commentCount++
                }
            })

            if (commentCount >= constants.limitPostCommentsUser || post.comments.length >= constants.limitPostComments) {
                return res.status(400).send("Comment limit reached")

            }

            if (text.length > 3) {
                return res.status(400).send("text is very small you cant post comment less than 3 characters !")

            }

            await post.updateOne({
                $push: {
                    comments: {
                        id: v4(),
                        userId,
                        text,
                        time: Date.now()
                    }
                }
            })

            const updatedPost = await Post.findOne({ _id: id }, { comments: 1 })

            res.status(200).json(updatedPost)

        } else {
            return res.status(404).send("None user or post with this id")
        }
    } catch (err) {
        return res.status(500).json(err)
    }
})


// delet comment for post :
router.delete("/:id/comment", async (req, res) => {
    try {
        const { id } = req.params
        const { userId, commentId } = req.body
        const post = await Post.findOne({ _id: id }, { comments: 1 })
        const user = await User.findOne({ _id: userId }, { _id: 1 })

        if (post._id && user._id && commentId) {

            await post.updateOne({
                $pull: {
                    comments: {
                        id: commentId,
                        userId,
                    }
                }
            })

            const updatedPost = await Post.findOne({ _id: id }, { comments: 1 })

            res.status(200).json(updatedPost)

        } else {
            return res.status(404).send("None user or post with this id")
        }
    } catch (err) {
        return res.status(500).json(err)
    }
})

router.put("/:id/add_viewsCount", async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req.params.id }, { viewsCount: 1 })

        if (post) {
            await post.updateOne({ $inc: { viewsCount: 1 } })
            res.status(200).send("Post has been adding viewsCount")

        } else {
            return res.status(404).send("None user or post with this id")
        }
    } catch (err) {
        return res.status(500).json(err)
    }
})


// get a posts :
router.get("/:id", async (req, res) => {
    try {
        // const { userId } = req.body
        // const user = await User.findOne({ _id: userId })
        const post = await Post.findOne({ _id: req.params.id })
        // if (post) {
        res.status(200).json(post)
        // } else {
        //     res.status(404).send("None post or user with this id")
        // }
    } catch (err) {
        res.status(500).json(err)
    }
})


// search for posts :
router.get("/search/all", async (req, res) => {
    try {
        console.log(req.query.labels)
        const { labels, category } = req.query
        console.log(labels, category)
        let searchPosts = { }

        if (labels && category) {
            let posts = await Post.find({ relatedHash: { $in: labels }, category }, { _id: 1, category: 1, relatedHash: 1 })
            posts = posts.reverse()
            posts.forEach(p => {
                searchPosts[p._id] = p
            })
        }
        if (category) {
            let posts = await Post.find({ category }, { _id: 1, category: 1, relatedHash: 1 })
            posts = posts.reverse()
            posts.forEach(p => {
                searchPosts[p._id] = p
            })
        }
        if (labels) {
            let posts = await Post.find({ relatedHash: { $in: labels } }, { _id: 1, category: 1, relatedHash: 1 })
            posts = posts.reverse()
            console.log(posts)
            posts.forEach(p => {
                searchPosts[p._id] = p
            })
        }
        res.status(200).json(searchPosts)

    } catch (err) {
        res.status(500).json(err)
    }
})



// get all posts for user
router.get("/timeline/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params
        const currentUser = await User.findOne({ _id: userId }, { _id: 1 })
        const currentUserPosts = await Post.find({ userId: currentUser._id }, { _id: 1 })
        res.status(200).json(currentUserPosts)
    } catch (err) {
        res.status(500).json(err)
    }
})

// get most view posts
router.get("/most_view/:limit", async (req, res) => {
    try {
        let limit = Number(req.params.limit)
        const posts = await Post.find({ }, { _id: 1, viewsCount: 1, createdAt: 1 }).limit(limit).sort({ viewsCount: 1, createdAt: 1 })
        res.status(200).json(posts.reverse())
    } catch (err) {
        res.status(500).json(err)
    }

})

// get most like posts
router.get("/most_like/:limit", async (req, res) => {
    try {
        let limit = Number(req.params.limit)

        const posts = await Post.find({ }, { _id: 1, likes: 1, createdAt: 1 }).limit(limit).sort({ likes: 1, createdAt: 1, })
        res.status(200).json(posts.reverse())
    } catch (err) {
        res.status(500).json(err)
    }

})


// get last posts
router.get("/last/:limit", async (req, res) => {
    try {
        let limit = Number(req.params.limit)
        const posts = await Post.find({ }, { _id: 1, createdAt: 1 }).limit(limit).sort({ createdAt: 1 })
        res.status(200).json(posts.reverse())
    } catch (err) {
        res.status(500).json(err)
    }

})



// get posts by category :
router.get("/category/:category", async (req, res) => {
    try {
        const { category } = req.params
        const posts = await Post.find({ category }, { _id: 1 })
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err)
    }
})


// get posts by relatedHash :
router.get("/relatedHash/:relatedHash", async (req, res) => {
    try {
        const { relatedHash } = req.params
        const posts = await Post.find({ relatedHash: { $in: relatedHash } }, { _id: 1 })
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err)
    }
})

// get all posts :
router.get("/p/all", async (req, res) => {
    try {
        const posts = await Post.find({ }, { _id: 1 })
        res.status(200).json(posts)
    } catch (err) {
        res.status(500).json(err)
    }
})

// get all posts id for user
router.get("/timeline/user_posts_is/:userId", async (req, res) => {
    try {
        const { userId } = req.params
        const currentUser = await User.findOne({ _id: userId }, { _id: 1 })
        const currentUserPosts = await Post.find({ userId: currentUser._id }, { _id: 1 })
        res.status(200).json(currentUserPosts)
    } catch (err) {
        res.status(500).json(err)
    }
})

// get all posts for my friends :
router.get("/timeline/fuser/:userId", async (req, res) => {
    try {
        const { userId } = req.params
        const currentUser = await User.findOne({ _id: userId }, { followings: 1 })
        const friendsPosts = await Promise.all(
            currentUser.followings.map(friendId => {
                return Post.find({ userId: friendId })
            })
        )
        res.status(200).json(friendsPosts)
    } catch (err) {
        res.status(500).json(err)
    }
})

// get all posts id for my friends :
router.get("/timeline/fuser_posts_id/:userId", async (req, res) => {
    try {
        const { userId } = req.params
        const currentUser = await User.findOne({ _id: userId }, { followings: 1 })
        const friendsPostsId = await Promise.all(
            currentUser.followings.map(friendId => {
                return Post.find({ userId: friendId }, { _id: 1 })
            })
        )
        res.status(200).json(friendsPostsId)
    } catch (err) {
        res.status(500).json(err)
    }
})


// get timeline posts :
router.get("/timeline/all/:userId", async (req, res) => {
    try {
        const { userId } = req.params
        const currentUser = await User.findOne({ _id: userId }, { followings: 1, _id: 1 })
        const currentUserPosts = await Post.find({ userId: currentUser._id })
        const friendsPosts = await Promise.all(
            currentUser.followings.map(friendId => {
                return Post.find({ userId: friendId })
            })
        )
        res.status(200).json(currentUserPosts.concat(...friendsPosts))
    } catch (err) {
        res.status(500).json(err)
    }
})


// get timeline posts :
router.get("/timeline/all_posts_id/:userId", async (req, res) => {
    try {
        const { userId } = req.params
        const currentUser = await User.findOne({ _id: userId }, { followings: 1, _id: 1 })
        const currentUserPostsId = await Post.find({ userId: currentUser._id }, { _id: 1 })
        const friendsPostsId = await Promise.all(
            currentUser.followings.map(friendId => {
                return Post.find({ userId: friendId }, { _id: 1 })
            })
        )
        res.status(200).json(currentUserPostsId.concat(...friendsPostsId))
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router
