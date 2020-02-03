const models = require('../../models')
const User = models.db.user
const ErrorHandler = require('../../middlewares/error').ErrorHandler
const {Op} = require('sequelize')

const join = (req, res, next) => {
    const {
        user_id,
        user_pw,
        email,
        nick,
        name
    } = req.body

    const create = (user) => {
        if (user) {
            throw new Error('EXIST')
        } else{
            return User.create({
                user_id,
                user_pw,
                email,
                nick,
                name
            }, {
                transaction : t
            })
        }
    }

    const respond = () => {
        res.json({
            message : '회원가입 성공',
            result : true
        })
    }

    const onError = (error) => {
        console.error(error)
        res.status(400).json(ErrorHandler(error.message))
    }

    models.sequelize.transaction(t => {
        return User.findOne({
            transaction : t,
            where : {
                user_id
            }
        })
        .then(create)
    })
    .then(respond)
    .catch(onError)
}

const getUsers = async (req, res) => {
    const limit = parseInt(req.query.limit || 10, 10) // default limit: 10
    if(Number.isNaN(limit)) return res.status(400).end()
    const users = await User.findAll({
        limit : limit
    })

    res.json(users)
}

const getUser = async (req, res) => {

}

const addUser = async ( req, res ) => {
    const { user_id, user_pw, email, nick, name } = req.body
    let user

    if(!(user_id && user_pw && email && nick && name)) return res.status(400).end()

    user = await User.findOne({
        where : {
            [Op.or] : [
                {'user_id' : user_id}, {'nick' : nick}
            ]
        }
    })
    if(user) return res.status(400).end()

    user = await User.create({
        user_id, user_pw, email, nick, name
    })

    res.json(user)
}

const updateUser = async ( req, res ) => {
    const user_id = req.params.id
    const { user_pw, email, nick, name } = req.body

    const nick_dupl = await User.findOne({
        where : {
            nick
        }
    })
    if(nick_dupl) return res.status(400).end()
    
    await User.update({user_pw, email, nick, name},{
        where : {
            user_id : user_id
        }
    })

    const afterUser = await User.findOne({
        where : {
            user_id
        }
    })
    if(!afterUser) return res.status(400).end()
    res.json(afterUser)
}

const deleteUser = async ( req, res ) => {
    const user_id = req.params.id
    if(!user_id) return res.status(400).end()

    const user = await User.findOne({
        where : {
            user_id
        }
    })
    if(!user) return res.status(400).end()

    await User.destroy({
        where : { 
            user_id
        }
    })

    res.status(204)
    res.json('삭제 성공')
}

module.exports = {
    getUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
};