//개발환경을 정하는것. 로컬환경과 배포했을때 production환경
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}