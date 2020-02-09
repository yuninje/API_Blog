const app = require("../../app");
const should = require("should");
const request = require("supertest");
const {LIMIT} = require('./post.ctrl')
const success = "성공";
const fail = "실패";

let exist_post;

describe(`GET /posts`, () => {
  describe(success, () => {
    it(`Post 배열을 반환한다.`, done => {
      request(app)
        .get(`/posts`)
        .end((err, res) => {
          res.body.should.have.property("result", true);
          res.body.should.have.property("data").with.instanceOf(Array);
          done();
        });
    });
    it(`최대 limit 갯수만큼 응답한다.`, done => {
      request(app)
        .get(`/posts?limit=2`)
        .end((err, res) => {
          res.body.should.have.property("result", true);
          res.body.should.have.property("data").with.lengthOf(2);
          done();
        });
    });
    it(`limit이 미입력되면 ${LIMIT}개를 응답한다.`, done => {
      request(app)
        .get("/posts")
        .end((err, res) => {
          res.body.should.have.property("result", true);
          res.body.should.have.property("data").with.lengthOf(LIMIT);
          done();
        });
    });
    it(`limit이 미입력되면 ${LIMIT}개를 응답한다.`, done => {
      request(app)
        .get("/posts?limit=two")
        .end((err, res) => {
          res.body.should.have.property("result", true);
          res.body.should.have.property("data").with.lengthOf(LIMIT);
          done();
        });
    });
  });
});

describe(`POST /posts`, () => {
  describe(success, () => {
    it(`요청한 정보의 게시글을 생성하고, 생성한 게시글의 정보를 응답한다.`, done => {
      request(app)
        .post(`/posts`)
        .send({
          user_id: "test",
          title: "title임니다",
          content: "content dㅣㅂ니다"
        })
        .end((err, res) => {
          res.body.should.have.property("result", true);
          res.body.should.have.property("data");
          exist_post = res.body.data.post_id
          done();
        });
    });
  });
  describe(fail, () => {
    it(`요청한 정보가 부족하면 400을 응답합니다.`, done => {
      request(app)
        .post(`/posts`)
        .send({
          user_id: "test",
          title: "타이틀일꼴"
        })
        .expect(400)
        .end((err, res) => {
          res.body.should.have.property("result", false);
          res.body.should.have.property("status", 400);
          done();
        });
    });
  });
});

describe(`GET /posts/:post_id`, () => {
  describe(success, () => {
    it(`요청한 정보의 게시글의 정보를 응답한다.`, done => {
      request(app)
        .get(`/posts/2`)
        .end((err, res) => {
          res.body.should.have.property("result", true);
          res.body.should.have.property("data");
          done();
        });
    });
  });
  describe(fail, () => {
    it(`요청한 정보의 게시글이 존재하지 않으면 400을 응답한다.`, done => {
      request(app)
        .get(`/posts/99999999`)
        .expect(400)
        .end((err, res) => {
          res.body.should.have.property("result", false);
          res.body.should.have.property("status", 400);
          done();
        });
    });
    it(`요청한 정보의 형식이 잘못되었으면 400을 응답한다.`, done => {
      request(app)
        .get(`/posts/error-`)
        .expect(400)
        .end((err, res) => {
          res.body.should.have.property("result", false);
          res.body.should.have.property("status", 400);
          done();
        });
    });
  });
});

describe(`PUT /posts/:post_id`, () => {
  describe(success, () => {
    it(`요청한 정보의 게시글을 수정하고, 해당 게시글 정보를 응답한다.`, done => {
      request(app)
        .put(`/posts/1`)
        .end((err, res) => {
            res.body.should.have.property('result', true)
            res.body.should.have.property('data')
          done();
        });
    });
  });
  describe(fail, () => {
    it(`요청한 정보의 게시글이 존재하지 않으면 400을 응답한다.`, done => {
      request(app)
      .put(`/posts/999999999`)
        .expect(400)
        .end((err, res) => {
            res.body.should.have.property('result', false)
            res.body.should.have.property('status', 400)
          done();
        });
    });
  });
});

describe(`DELETE /posts/:post_id`, () => {
  describe(success, () => {
    it(`요청한 정보의 게시글을 삭제한다.`, done => {
      request(app)
        .delete(`/posts/${exist_post}`)
        .end((err, res) => {
            res.body.should.have.property('result', true)
            res.body.should.have.property('data', '게시글 삭제 성공')
          done();
        });
    });
  });
  describe(fail, () => {
    it(`요청한 정보의 게시글이 존재하지 않으면 400을 응답한다.`, done => {
      request(app)
      .delete(`/posts/999999999`)
        .expect(400)
        .end((err, res) => {
            res.body.should.have.property('result', false)
            res.body.should.have.property('status', 400)
          done();
        });
    });
  });
});
