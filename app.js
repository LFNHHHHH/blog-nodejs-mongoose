var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var router = require('./router')
var session = require('express-session')

var app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
    secret: 'my blog',
    resave: false,
    saveUninitialized: true
}))

app.use(router)  // 把路由挂载到 app 服务中

app.listen(5000, function() {
    console.log('app is running..')
})
