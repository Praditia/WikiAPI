const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

mongoose.connect('mongodb://localhost:27017/wikiDB');

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static('public'));

app.set('view engine', 'ejs');

const articlesSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model('article', articlesSchema);

app
  .route('/articles')
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send('New article successfully added');
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send('All articles are deleted');
      } else {
        res.send(err);
      }
    });
  });

app
  .route('/articles/:articleTitle')

  .get(function (req, res) {
    Article.findOne(
      {
        title: req.params.articleTitle,
      },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send('No matching article');
        }
      }
    );
  });

let port = process.env.PORT;
if (port == null || port == '') {
  port = 3000;
}

app.listen(port, function () {
  console.log('The server is running successfully');
});
