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
                    res.body.should.be.instanceOf(Array)
                    done()
                })
        })

        it('최대 limit 갯수만큼 응답한다.', done => {
            request(app)
                .get('/users?limit=2')
                .end((err, res) => {
                    res.body.should.have.lengthOf(2)
                    done()
                })
        })
    })
    describe(fail, () =>{
        it('limit 이 숫자형이 아니면 400 을 응답한다.', done => {
            request(app)
                .get( '/users?limit=two' )
                .expect(400)
                .end(done)
        })
    })
})

describe('POST /users', () => {
    const url = 'users'
    describe(success, () =>{
        it('생성된 유저 객체를 반환한다.', done => {
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
        it('user_id 가 중복되면 400 응답한다.', done => {
            request(app)
                .post('/users')
                .send({
                    'user_id' : 'dbs',
                    'user_pw' : 'dbs123',
                    'email' : 'dbsdlswp@naver.com',
                    'nick' : '코봉이1',
                    'name' : '윤인제'
                })
                .expect(400)
                .end(done)
        })
        it('nick 가 중복되면 400 응답한다.',done => {
            request(app)
                .post('/users')
                .send({
                    'user_id' : 'dbsdlswp1',
                    'user_pw' : 'dbs123',
                    'email' : 'dbsdlswp@naver.com',
                    'nick' : '코봉이',
                    'name' : '윤인제'
                })
                .expect(400)
                .end(done)
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
        it('204를 응답한다.', done => {
            request(app)
                .delete('/users/dbsdlswp')
                .expect(204)
                .end(done)
        })
    })
    describe(fail, () => {
        it('해당 id의 유저가 존재하지 않으면 400을 응답한다.', done => {
            request(app)
                .delete('/users/adfafdsf321' )
                .expect(400)
                .end(done)
        })
    })
})

