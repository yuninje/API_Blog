const models = require("../../models");
const Comment = models.db.comment;
const { ErrorHandler, errors } = require("../../middlewares/error");
const { Op } = require("sequelize");

const LIMIT = 5

// 모든 댓글의 정보를 가져오는 메소드 ( limit * (page-1) ~ limit * page )
const getComments = (req, res) => {
    let { limit, page } = req.query;
    limit = parseInt(limit, 10) || LIMIT;
    page = parseInt(page, 10) || 1;
  
    const respond = comments => {
      res.json({
        result: true,
        data: comments
      });
    };
  
    const onError = error => {
      //console.error(error);
      res.status(400).json(ErrorHandler(error.message));
    };
  
    models.sequelize
      .transaction(async t => {
        const comments = await Comment.findAll({
          limit: limit,
          offset: (page - 1) * limit,
          transaction: t
        });
        if (!comments) throw new Error(""); // process error
        return comments;
      })
      .then(respond)
      .catch(onError);

}

// comment_id 의 정보를 가진 댓글의 정보를 가져오는 메소드
const getComment = (req, res) => {
    const { comment_id } = req.params;
  
    const respond = comment => {
      res.json({
        result: true,
        data: comment
      });
    };
  
    const onError = error => {
      //console.error(error);
      res.status(400).json(ErrorHandler(error.message));
    };
  
    models.sequelize
      .transaction(async t => {
        const comment = await Comment.findOne({
          where: { comment_id },
          transaction: t
        });
        if (!comment) throw new Error(errors.BADREQ);
        return comment;
      })
      .then(respond)
      .catch(onError);
}

// 댓글을 추가하는 메소드
const addComment = (req, res) => {
    const { user_id, post_id, title, content } = req.body;
  
    const respond = comment => {
      res.json({
        result: true,
        data: comment
      });
    };
  
    const onError = error => {
      //console.error(error);
      res.status(400).json(ErrorHandler(error.message));
    };
  
    models.sequelize
      .transaction(async t => {
        const comment = await Comment.create(
          {
            user_id,
            post_id,
            content
          },
          {
            transaction: t
          }
        );
        if (!comment) throw new Error("");
        return comment;
      })
      .then(respond)
      .catch(onError);

}

// 댓글을 수정하는 메소드
const updateComment = (req, res) => {
  const { comment_id } = req.params;
  const { content } = req.body;

  const respond = () => {
    res.json({
      result: true,
      data: '댓글 수정 성공'
    });
  };

  const onError = error => {
    //console.error(error);
    res.status(400).json(ErrorHandler(error.message));
  };

  models.sequelize
    .transaction(async t => {
      let comment = await Comment.findOne({
        where: { comment_id },
        transaction: t
      });
      if (!comment) throw new Error(errors.BADREQ);

      await Comment.update(
        {
          content
        },
        {
          where: { comment_id },
          transaction: t
        }
      );
    })
    .then(respond)
    .catch(onError);
}

// 댓글을 삭제하는 메소드
const deleteComment = (req, res) => {
    const { comment_id } = req.params;

    const respond = () => {
      res.json({
        result: true,
        data: "댓글 삭제 성공"
      });
    };
  
    const onError = error => {
      //console.error(error);
      res.status(400).json(ErrorHandler(error.message));
    };
  
    models.sequelize
      .transaction(async t => {
        const comment = await Comment.findOne({
          where: { comment_id },
          transaction: t
        });
        if (!comment) throw new Error(errors.BADREQ);
        await Comment.destroy({
          where: { comment_id },
          transaction: t
        });
      })
      .then(respond)
      .catch(onError);
}

module.exports = {
    LIMIT,
    getComments,
    getComment,
    addComment,
    updateComment,
    deleteComment
};