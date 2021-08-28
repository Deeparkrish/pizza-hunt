
const { Comment, Pizza } = require('../models');

const commentController = {
  // createPizza
  addComment({params, body }, res) {
    Comment.create(body)
    .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $push: { comments: _id } },
          { new: true }
        );
      })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
     
  },


  // delete pizza
  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then(dbCommentData => {
        if (!dbCommentData) {
          res.status(404).json({ message: 'No comment found with this id!' });
          return;
        }
        return Pizza.findOneAndUpdate(
            { _id: params.pizzaId },
            { $pull: { comments: params.commentId } },
            { new: true }     );
      })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  }
};

module.exports = commentController;
