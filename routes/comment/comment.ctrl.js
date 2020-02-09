const models = require("../../models");
const Comment = models.db.comment;
const { ErrorHandler, errors } = require("../../middlewares/error");
const { Op } = require("sequelize");

// 모든 댓글의 정보를 가져오는 메소드 ( limit * (page-1) ~ limit * page )
const getComments = (req, res) => {

}

// comment_id 의 정보를 가진 댓글의 정보를 가져오는 메소드
const getComment = (req, res) => {

}

// 댓글을 추가하는 메소드
const addComment = (req, res) => {

}

// 댓글을 수정하는 메소드
const updateComment = (req, res) => {

}

// 댓글을 삭제하는 메소드
const deleteComment = (req, res) => {

}

module.exports = {
    getComments,
    getComment,
    addComment,
    updateComment,
    deleteComment
};