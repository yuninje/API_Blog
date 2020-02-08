const app = require('../../app')
const should = require('should')
const request = require('supertest')

const success = '성공'
const fail = '실패'



describe('GET /users', () => {
    describe(success, () =>{
        it('User 배열을 반환한다.', done => {
            request(app)
                .get('/users')
                .end((err, res) => {
                    res.body.should.have.property('data').with.instanceOf(Array)
                    done()
                })
        })

        it('최대 limit 갯수만큼 응답한다.', done => {
            request(app)
                .get('/users?limit=2')
                .end((err, res) => {
                    res.body.should.have.property('data').with.lengthOf(2)
                    done()
                })
        }),
        it('limit이 잘못 입력되거나 미입력되면 5개를 응답한다.', done => {
            request(app)
                .get( '/users?limit=two' )
                .end((err, res) => {
                    res.body.should.have.property('data').with.lengthOf(5)
                    done()
                })
        })
    })
})

describe('POST /users', () => {
    const url = 'users'
    describe(success, () =>{
        it(`result : true, data : '회원 가입 성공'`, done => {
            request(app)
                .post('/users')
                .send({
                    'user_id' : 'dbsdlswp',
                    'user_pw' : 'dbs123',
                    'email' : 'dbsdlswp@naver.com',
                    'nick' : '코봉이',
                    'name' : '윤인제'
                })
                .end((err, res) => {
                    res.body.should.have.property('result', true)
                    res.body.should.have.property('data', '회원 가입 성공')
                    done()
                })
        })
    })
    describe(fail, () => {
        it('user_id 가 중복되면 409 응답한다.', done => {
            request(app)
                .post('/users')
                .send({
                    'user_id' : 'dbsdlswp',
                    'user_pw' : 'dbs123',
                    'email' : 'dbsdlswp@naver.com',
                    'nick' : '코봉이3121',
                    'name' : '윤인제1231'
                })
                .expect(400)
                .end((err, res) => {
                    res.body.should.have.property('result', false)
                    res.body.should.have.property('status', 409)
                    res.body.should.have.property('message', 'Conflict')
                    done()
                })
        })
        it('nick 가 중복되면 400 응답한다.',done => {
            request(app)
                .post('/users')
                .send({
                    'user_id' : 'dbsdlswp112313',
                    'user_pw' : 'dbs121233',
                    'email' : 'dbsdl123swp@naver.com',
                    'nick' : 'aaaa',
                    'name' : '윤444인제'
                })
                .expect(400)
                .end((err, res) => {
                    console.log('nick 중복 err')
                    res.body.should.have.property('result', false)
                    res.body.should.have.property('status', 409)
                    res.body.should.have.property('message', 'Conflict')
                    done()
                })
        })
        it('빠진 데이터가 있으면 400 응답한다.', done => {
            request(app)
                .post('/users')
                .send({
                    'user_id' : 'dbsdlswp1',
                    'user_pw' : 'dbs123',
                    'nick' : '코봉이',
                    'name' : '윤인제'
                })
                .expect(400)
                .end(done)
        })

    })
})

describe('UPDATE /users/:id', () => {
    describe(success, () => {
        it('수정된 유저 객체를 반환한다.', done => {
            request(app)
                .put('/users/dbsdlswp')
                .send({
                    'user_pw' : '1234',
                    'email' : 'aaaaaa@aaa.com',
                    'nick' : 'asdfasfd',
                    'name' : 'spdpdpdla'
                })
                .end((err, res) => {
                    res.body.should.have.property('user_id')
                    res.body.should.have.property('user_pw')
                    res.body.should.have.property('email')
                    res.body.should.have.property('nick')
                    res.body.should.have.property('name')
                    done()
                })
        })        
    })
    describe(fail, () => {
        it('해당 id의 유저가 존재하지 않으면 400을 응답한다.', done => {
            request(app)
                .put('/users/aaaaabbbbb11')
                .send({
                    'user_pw' : '1234',
                    'email' : 'aaaaaa@aaa.com',
                    'nick' : 'asdfasfd',
                    'name' : 'spdpdpdla'
                })
                .expect(400)
                .end(done)
        })
        it('nick 이 중복되면 400을 응답한다.', done => {
            request(app)
                .put('/users/dbsdlswp')
                .send({
                    'user_pw' : '1234',
                    'email' : 'aaaaaa@aaa.com',
                    'nick' : '코봉이32123',
                    'name' : 'spdpdpdla'
                })
                .expect(400)
                .end(done)
        })
    })
})

describe('DELETE /users/:id', () => {
    describe(success, () => {
        it(`data : '회원 탈퇴 성공', result : true`, done => {
            request(app)
                .delete('/users/dbsdlswp')
                .end((err, res) => {
                    res.body.should.have.property('result', true)
                    res.body.should.have.property('data', '회원 탈퇴 성공')
                    done()
                })
        })
    })
    describe(fail, () => {
        it('해당 id의 유저가 존재하지 않으면 400을 응답한다.', done => {
            request(app)
                .delete('/users/adfafdsf321sfd')
                .end((err, res) => {
                    res.body.should.have.property('result', false)
                    res.body.should.have.property('status', 400)
                    done()
                })
        })
    })
})

