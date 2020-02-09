const models = require("../../models");
const User = models.db.user;
const { ErrorHandler, errors } = require("../../middlewares/error");
const { Op } = require("sequelize");

const getUsers = (req, res) => {
  let { limit, page } = req.query;
  limit = parseInt(limit, 10) || 5;
  page = parseInt(page, 10) || 1;

  const respond = users => {
    res.json({
      result: true,
      data: users
    });
  };

  const onError = error => {
    //console.error(error);
    res.status(400);
  };

  models.sequelize
    .transaction(async t => {
      const users = User.findAll({
        limit: limit,
        offset: limit * (page - 1),
        transaction: t
      });
      return users;
    })
    .then(respond)
    .catch(onError);
};

const getUser = (req, res) => {
  const { user_id } = req.params;

  const respond = user => {
    res.json({
      result: true,
      data: user
    });
  };

  const onError = error => {
    //console.error(error);
    res.status(400);
  };

  models.sequelize
    .transaction(async t => {
      const user = await User.findOne({
        where: { user_id },
        transaction: t
      });
      if (!user) throw new Error(errors.BADREQ);
    })
    .then(respond)
    .catch(onError);
};

const addUser = (req, res) => {
  const { user_id, user_pw, email, nick, name } = req.body;

  const respond = () => {
    res.json({
      result: true,
      data: "회원 가입 성공"
    });
  };

  const onError = error => {
    //console.error(error);
    res.status(400).json(ErrorHandler(error.message));
  };

  models.sequelize
    .transaction(async t => {
      if (!(user_id && user_pw && email && nick && name))
        throw new Error(errors.BADREQ);
      const user = await User.findOne({
        where: {
          [Op.or]: [{ user_id: user_id }, { nick: nick }]
        },
        transaction: t
      });
      if (user) throw new Error(errors.EXIST);

      await User.create(
        {
          user_id,
          user_pw,
          email,
          nick,
          name
        },
        {
          transaction: t
        }
      );
    })
    .then(respond)
    .catch(onError);
};

const updateUser = (req, res) => {
  const { user_id } = req.params;
  const { name, email, nick, user_pw } = req.body;

  const respond = () => {
    res.json({
      result: true,
      data: "회원 정보 수정 성공"
    });
  };

  const onError = error => {
    //console.error(error);
    res.status(400).json(ErrorHandler(error.message));
  };

  models.sequelize
    .transaction(async t => {
      let user = await User.findOne({
        where: { user_id },
        transaction: t
      });
      if (!user) throw new Error(errors.BADREQ);
      user = await User.findOne({
        where: { nick },
        transaction: t
      });
      if (user) throw new Error(errors.EXIST);
      await User.update(
        {
          user_pw,
          email,
          nick,
          name
        },
        {
          where: { user_id },
          transaction: t
        }
      );
    })
    .then(respond)
    .catch(onError);
};

const deleteUser = (req, res) => {
  const { user_id } = req.params;

  const respond = () => {
    res.json({
      result: true,
      data: "회원 탈퇴 성공"
    });
  };

  const onError = error => {
    //console.error(error);
    res.status(400).json(ErrorHandler(error.message));
  };

  models.sequelize
    .transaction(async t => {
      transaction = t;
      const user = await User.findOne({
        where: { user_id }
      });
      if (!user) throw new Error(errors.BADREQ);
      await User.destroy({
        where: { user_id }
      });
    })
    .then(respond)
    .catch(onError);
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser
};
