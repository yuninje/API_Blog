const app = require("../../app");
const should = require("should");
const request = require("supertest");
const {LIMIT} = require('./user.ctrl')

const success = "성공";
const fail = "실패";

describe("GET /users", () => {
  describe(success, () => {
    it("유저 배열을 응답한다.", done => {
      request(app)
        .get("/users")
        .end((err, res) => {
          res.body.should.have.property("result", true);
          res.body.should.have.property("data").with.instanceOf(Array);
          done();
        });
    });

    it("요청한 limit 갯수만큼 응답한다.", done => {
      request(app)
        .get("/users?limit=2")
        .end((err, res) => {
          res.body.should.have.property("result", true);
          res.body.should.have.property("data").with.lengthOf(2);
          done();
        });
    }),
    it(`요청한 limit이 잘못된 정보라면 ${LIMIT}개를 응답한다.`, done => {
      request(app)
        .get("/users?limit=two")
        .end((err, res) => {
          res.body.should.have.property("data").with.lengthOf(LIMIT);
          done();
        });
    });
    it(`limit이 요청되지 않았으면 ${LIMIT}개를 응답한다.`, done => {
      request(app)
        .get("/users")
        .end((err, res) => {
          res.body.should.have.property("data").with.lengthOf(LIMIT);
          done();
        });
    });
  });
});

describe("POST /users", () => {
  const url = "users";
  describe(success, () => {
    it(`요청한 정보의 유저를 생성한다.`, done => {
      request(app)
        .post("/users")
        .send({
          user_id: "dbsdlswp",
          user_pw: "dbs123",
          email: "dbsdlswp@naver.com",
          nick: "코봉이",
          name: "윤인제"
        })
        .end((err, res) => {
          res.body.should.have.property("result", true);
          res.body.should.have.property("data", "회원 가입 성공");
          done();
        });
    });
  });
  describe(fail, () => {
    it("요청한 user_id가 이미 존재하면 400을 응답한다.", done => {
      request(app)
        .post("/users")
        .send({
          user_id: "dbsdlswp",
          user_pw: "dbs123",
          email: "dbsdlswp@naver.com",
          nick: "코봉이3121",
          name: "윤인제1231"
        })
        .expect(400)
        .end((err, res) => {
          res.body.should.have.property("result", false);
          res.body.should.have.property("status", 409);
          done();
        });
    });
    it("요청한 nick이 이미 존재하면 400 응답한다.", done => {
      request(app)
        .post("/users")
        .send({
          user_id: "dbsdlswp112313",
          user_pw: "dbs121233",
          email: "dbsdl123swp@naver.com",
          nick: "aaaa",
          name: "윤444인제"
        })
        .expect(400)
        .end((err, res) => {
          res.body.should.have.property("result", false);
          res.body.should.have.property("status", 409);
          done();
        });
    });
    it("요청한 데이터가 부족하면 400 응답한다.", done => {
      request(app)
        .post("/users")
        .send({
          user_id: "dbsdlswp1",
          user_pw: "dbs123",
          nick: "코봉이",
          name: "윤인제"
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

describe(`GET /users/:user_id`, () => {
  describe(success, () => {
    it(`요청한 user_id의 유저 정보를 반환한다.`, done => {
      request(app)
        .get(`/users/dbsdlswp`)
        .end((err, res) => {
          res.body.should.have.property("result", true);
          res.body.should.have.property("data");
          done();
        });
    });
  });
  describe(fail, () => {
    it(`요청한 user_id의 유저가 존재하지 않으면 400을 응답한다.`, done => {
      request(app)
        .get(`/users/not_exist_user_id`)
        .expect(400)
        .end((err, res) => {
          res.body.should.have.property("result", false);
          res.body.should.have.property("status", 400);
          done();
        });
    });
  });
});

describe("PUT /users/:user_id", () => {
  describe(success, () => {
    it(`요청한 user_id의 유저의 정보를 수정한다.`, done => {
      request(app)
        .put("/users/dbsdlswp")
        .send({
          user_pw: "1234",
          email: "aaaaaa@aaa.com",
          nick: "asdfasfd",
          name: "spdpdpdla"
        })
        .end((err, res) => {
          res.body.should.have.property("result", true);
          res.body.should.have.property("data", "회원 정보 수정 성공");
          done();
        });
    });
  });
  describe(fail, () => {
    it(`요청한 user_id의 유저가 존재하지 않으면 400을 응답한다.`, done => {
      request(app)
        .put("/users/not_exist_user_id")
        .send({
          user_pw: "1234",
          email: "aaaaaa@aaa.com",
          nick: "asdfasfd",
          name: "spdpdpdla"
        })
        .expect(400)
        .end((err, res) => {
          res.body.should.have.property("result", false);
          res.body.should.have.property("status", 400);
          done();
        });
    });
    it("요청한 nick이 이미 존재하면 400을 응답한다.", done => {
      request(app)
        .put("/users/dbsdlswp")
        .send({
          user_pw: "1234",
          email: "aaaaaa@aaa.com",
          nick: "test",
          name: "spdpdpdla"
        })
        .expect(400)
        .end((err, res) => {
          res.body.should.have.property("result", false);
          res.body.should.have.property("status", 409);
          done();
        });
    });
  });
});

describe("DELETE /users/:user_id", () => {
  describe(success, () => {
    it(`요청한 user_id의 유저 정보를 삭제한다.`, done => {
      request(app)
        .delete("/users/dbsdlswp")
        .expect(400)
        .end((err, res) => {
          res.body.should.have.property("result", true);
          res.body.should.have.property("data", "회원 탈퇴 성공");
          done();
        });
    });
  });
  describe(fail, () => {
    it("요청한 user_id의 유저가 존재하지 않으면 400을 응답한다.", done => {
      request(app)
        .delete("/users/not_exist_user_id")
        .expect(400)
        .end((err, res) => {
          res.body.should.have.property("result", false);
          res.body.should.have.property("status", 400);
          done();
        });
    });
  });
});
