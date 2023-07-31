const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

const mongoose = require("mongoose");
db = mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articlesSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articlesSchema);


app.get("/", function(req, res){
    res.send("Hello")
})

// THE BELOW COMMENTED CODE HAS BEEN REPLACED WITH APP.ROUTE.
// app.get("/articles", function(req, res){
//     Article.find()
//         .then(function(foundArticles){
//             foundArticles.forEach(function(article){
//                 console.log(article.title)
//             })
//             res.send(foundArticles) //similar to accessing public access APIs
//         })

//         .catch(function(err){
//             console.log(err);
//         })
// })

// app.post("/articles", function(req, res){
//     //console.log(req.body.title) //demonstrate that requests can be made through postman
//     //console.log(req.body.content)

//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     });

//     newArticle.save();

//     res.send("Sent.");

// });

// app.delete("/articles", function(req, res){
//     Article.deleteMany()
//         .then(function(){
//             console.log('Successfully deleted all articles')
//         })
//         .catch(function(err){
//             console.log(err)
//         })
// })

app.route("/articles")

    .get(function(req,res){

        Article.find()
            .then(function(foundArticles){
                // foundArticles.forEach(function(article){
                //     console.log(article.title)
                // })
                res.send(foundArticles) //similar to accessing public access APIs
            })
            .catch(function(err){
                console.log(err);
            })

    })

    .post(function(req, res){ 
        //there really should be something to validate that there isnt already a post with the same title. But since this is a follow-along, i'll leave it be.
        //console.log(req.body.title) //demonstrate that requests can be made through postman
        //console.log(req.body.content)

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save();

        res.send("Sent post request.");
    })

    .delete(function(req, res){

        Article.deleteMany()

            .then(function(){
                res.send('Successfully deleted all articles')
            })

            .catch(function(err){
                console.log(err)
            })

    })


app.route("/articles/:articleTitle")

    .get(function(req,res){

        Article.findOne({title:req.params.articleTitle})

            .then(function(article){
                res.send(article.content)
            })

            .catch(function(err){
                res.send("No matching articles found.");
            })


    })

    .put(function(req,res){ //put requests replace the entire resource.
        Article.replaceOne(
            {title: req.params.articleTitle}, //target only the articleTitle
            {title: req.body.title,
            content: req.body.content}, //change content it to the content of the req.

        )

        .then(function(article){
            console.log(article)
            if (article.matchedCount === 0){
                res.send("No match found, replacement unsuccessful")
            }

            res.send("Article replaced")
        })

        .catch(function(err){
            res.send("No article found, not deleted.");
        })
    })

    .patch(function(req, res){

        Article.updateOne(
            {title:req.params.articleTitle},
            {title:req.body.title,
            content: req.body.content}
        )

        .then(function(article){
            //console.log(article)
            //below 5 lines are to ensure that it does not send success message when nothing is updated.
            if (article.matchedCount === 0){
                res.send("No match found, update unsuccessful");
            } else {
                res.send("Successfully updated")
            }


        })

        .catch(function(err){
            console.log(err)
        })

    })

    .delete(function(req, res){

        Article.deleteOne({title: req.params.articleTitle})

        .then(function(article){
            //console.log(article)
            //below 5 lines are to ensure that it does not send success message when nothing is deleted.
            if (article.matchedCountCount === 0) {
                res.send("Article not found. Deletion unsuccessful.")
            } else {
                res.send("Successfully deleted one article")
            }
        })

        .catch(function(err){
            res.send("Error. Deletion unsuccessful")
        })

    })


app.listen("3000", function(){
    console.log("Running on port 3000");
})