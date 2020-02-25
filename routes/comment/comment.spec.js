const app = require("../../app");
const should = require("should");
const request = require("supertest");
const {LIMIT} = require('./comment.ctrl')
const success = "성공";
const fail = "실패";

let exist_comment

describe(`GET /comments`, () => {
    describe(success, () => {
        it(`Comment 배열을 반환한다.`, done => {
            request(app)
            .get(`/comments`)
            .end((err,res) => {
                res.body.should.have.property("result", true);
                res.body.should.have.property("data").with.instanceOf(Array);
                done()
            })
        })
        it(`최대 limit 개수만큼 응답한다.`, done => {
            request(app)
            .get(`/comments?limit=2`)
            .expect(400)
            .end((err,res) => {
                res.body.should.have.property("result", true);
                res.body.should.have.property("data").with.lengthOf(2);
                done()
            })
        })
        it(`limit이 미입력되면 ${LIMIT}개를 응답한다.`, done => {
          request(app)
            .get("/comments")
            .end((err, res) => {
              res.body.should.have.property("result", true);
              res.body.should.have.property("data").with.lengthOf(LIMIT);
              done();
            });
        });
        it(`limit이 잘못 입력되면 ${LIMIT}개를 응답한다.`, done => {
          request(app)
            .get("/comments?limit=two")
            .end((err, res) => {
              res.body.should.have.property("result", true);
              res.body.should.have.property("data").with.lengthOf(LIMIT);
              done();
            });
        });
    })
})

describe(`POST /comments`, () => {
    describe(success, () => {
      it(`요청한 정보의 댓글을 생성한다.`, done => {
        request(app)
          .post(`/comments`)
          .send({
            user_id: "test",
            post_id: 1,
            content: "content dㅣㅂ니다"
          })
          .end((err, res) => {
            res.body.should.have.property("result", true);
            res.body.should.have.property("data");
            exist_comment = res.body.data.comment_id
            done();
          });
      });
    });
    describe(fail, () => {
      it(`요청한 정보가 부족하면 400을 응답합니다.`, done => {
        request(app)
          .post(`/comments`)
          .send({})
          .expect(400)
          .end((err, res) => {
            res.body.should.have.property("result", false);
            res.body.should.have.property("status", 400);
            done();
          });
      });
    });
  });

  
describe(`GET /comments/:comment_id`, () => {
    describe(success, () => {
      it(`요청한 정보의 댓글의 정보를 응답한다.`, done => {
        request(app)
          .get(`/comments/${exist_comment}`)
          .end((err, res) => {
            res.body.should.have.property("result", true);
            res.body.should.have.property("data");
            done();
          });
      });
    });
    describe(fail, () => {
      it(`요청한 정보의 댓글이 존재하지 않으면 400을 응답한다.`, done => {
        request(app)
          .get(`/comments/99999999`)
          .expect(400)
          .end((err, res) => {
            res.body.should.have.property("result", false);
            res.body.should.have.property("status", 400);
            done();
          });
      });
      it(`요청한 정보의 형식이 잘못되었으면 400을 응답한다.`, done => {
        request(app)
          .get(`/comments/error-`)
          .expect(400)
          .end((err, res) => {
            res.body.should.have.property("result", false);
            res.body.should.have.property("status", 400);
            done();
          });
      });
    });
  });
  
  describe(`PUT /comments/:comment_id`, () => {
    describe(success, () => {
      it(`요청한 정보의 댓글을 수정한다.`, done => {
        request(app)
          .put(`/comments/${exist_comment}`)
          .end((err, res) => {
              res.body.should.have.property('result', true)
              res.body.should.have.property('data', '댓글 수정 성공')
            done();
          });
      });
    });
    describe(fail, () => {
      it(`요청한 정보의 댓글이 존재하지 않으면 400을 응답한다.`, done => {
        request(app)
        .put(`/comments/999999999`)
          .expect(400)
          .end((err, res) => {
              res.body.should.have.property('result', false)
              res.body.should.have.property('status', 400)
            done();
          });
      });
    });
  });
  
  describe(`DELETE /comments/:comment_id`, () => {
    describe(success, () => {
      it(`요청한 정보의 댓글을 삭제한다.`, done => {
        request(app)
          .delete(`/comments/${exist_comment}`)
          .end((err, res) => {
              res.body.should.have.property('result', true)
              res.body.should.have.property('data', '댓글 삭제 성공')
            done();
          });
      });
    });
    describe(fail, () => {
      it(`요청한 정보의 댓글이 존재하지 않으면 400을 응답한다.`, done => {
        request(app)
        .delete(`/comments/999999999`)
          .expect(400)
          .end((err, res) => {
              res.body.should.have.property('result', false)
              res.body.should.have.property('status', 400)
            done();
          });
      });
    });
  });
  