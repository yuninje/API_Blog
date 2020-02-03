const app = require('./app')
const models = require('./models');        // /models/index.js 모듈에서 sequelize 객체 반환 
const PORT = process.env.PORT || 3000

// app.get('port') 에서 포트 대기
models.sequelize.sync({
    force : false
}).then(_ => {
    app.listen(PORT, () => console.log(`Open server on ${PORT}`))
})