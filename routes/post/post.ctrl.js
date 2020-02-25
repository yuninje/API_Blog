const models = require("../../models");
const Post = models.db.post;
const Comment = models.db.comment;
const { ErrorHandler, errors } = require("../../middlewares/error");
const { Op } = require("sequelize");

const LIMIT = 5

// 모든 게시글의 정보를 가져오는 메소드 ( limit * (page-1) ~ limit * page )
const getPosts = (req, res) => {
  let { limit, page } = req.query;
  limit = parseInt(limit, 10) || LIMIT;
  page = parseInt(page, 10) || 1;

  const respond = posts => {
    res.json({
      result: true,
      data: posts
    });
  };

  const onError = error => {
    //console.error(error);
    res.status(400).json(ErrorHandler(error.message));
  };

  models.sequelize
    .transaction(async t => {
      const posts = await Post.findAll({
        limit: limit,
        offset: (page - 1) * limit,
        include : Comment,
        transaction: t
      });
      if (!posts) throw new Error(""); // process error
      return posts;
    })
    .then(respond)
    .catch(onError);
};

// post_id 의 정보를 가진 게시글의 정보를 가져오는 메소드
const getPost = (req, res) => {
  const { post_id } = req.params;

  const respond = post => {
    res.json({
      result: true,
      data: post
    });
  };

  const onError = error => {
    //console.error(error);
    res.status(400).json(ErrorHandler(error.message));
  };

  models.sequelize
    .transaction(async t => {
      const post = await Post.findOne({
        where: { post_id },
        transaction: t
      });
      if (!post) throw new Error(errors.BADREQ);
      return post;
    })
    .then(respond)
    .catch(onError);
};

// 게시글을 추가하는 메소드
const addPost = (req, res) => {
  const { user_id, title, content } = req.body;

  const respond = post => {
    res.json({
      result: true,
      data: post
    });
  };

  const onError = error => {
    //console.error(error);
    res.status(400).json(ErrorHandler(error.message));
  };

  models.sequelize
    .transaction(async t => {
      const post = await Post.create(
        {
          user_id,
          title,
          content
        },
        {
          transaction: t
        }
      );
      if (!post) throw new Error("");
      return post;
    })
    .then(respond)
    .catch(onError);
};

// 게시글을 수정하는 메소드
const updatePost = (req, res) => {
  const { post_id } = req.params;
  const { title, content } = req.body;
  const respond = post => {
    res.json({
      result: true,
      data: post
    });
  };

  const onError = error => {
    //console.error(error);
    res.status(400).json(ErrorHandler(error.message));
  };

  models.sequelize
    .transaction(async t => {
      let post = await Post.findOne({
        where: { post_id },
        transaction: t
      });
      if (!post) throw new Error(errors.BADREQ);

      await Post.update(
        {
          title,
          content
        },
        {
          where: { post_id },
          transaction: t
        }
      );

      post = await Post.findOne({
        where: { post_id },
        transaction: t
      });

      return post;
    })
    .then(respond)
    .catch(onError);
};

// 게시글을 삭제하는 메소드
const deletePost = (req, res) => {
  const { post_id } = req.params;
  const respond = () => {
    res.json({
      result: true,
      data: "게시글 삭제 성공"
    });
  };

  const onError = error => {
    //console.error(error);
    res.status(400).json(ErrorHandler(error.message));
  };

  models.sequelize
    .transaction(async t => {
      const post = await Post.findOne({
        where: { post_id },
        transaction: t
      });
      if (!post) throw new Error(errors.BADREQ);
      await Post.destroy({
        where: { post_id },
        transaction: t
      });
    })
    .then(respond)
    .catch(onError);
};

module.exports = {
  LIMIT,
  getPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
};
