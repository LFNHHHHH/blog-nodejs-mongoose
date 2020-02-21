var express = require('express')
var Users = require('./models/user')
var md5 = require('blueimp-md5')

var router = express.Router()

router.get('/', function (req, res) {  // 首页页面渲染
    res.render('index.html', {
        user: req.session.user
    })
})

router.get('/login', function (req, res) {  // 登录页面渲染
    res.render('login.html')
})

router.post('/login', function (req, res, next) {  // 登录请求发送
    var body = req.body
    Users.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, function (err, user) {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invalid.'
            })
        }

        req.session.user = user  // 用户登录成功，通过 session 记录登录状态

        res.status(200).json({
            err_code: 0,
            message: 'Ok'
        })
    })
})

router.get('/register', function (req, res) {  // 注册页面渲染
    res.render('register.html')
})

router.post('/register', function (req, res, next) {  // 注册页面请求发送
    var body = req.body
    Users.findOne({
        $or: [{
                email: body.email
            },
            {
                nickname: body.nickname
            }
        ]
    }, function (err, data) {
        if (err) {  // 查询失败
            return next(err)
        }
        if (data) {  // 邮箱 或 昵称 已存在
            return res.status(200).json({
                err_code: 1,
                message: 'Email or nickname aleady exists!'
            })
        }

        body.password = md5(md5(body.password))  // 对用户密码进行 md5 加密

        new Users(body).save(function (err, data) {
            if (err) {
                return next(err)
            }

            req.session.user = data  // 注册成功后，使用 Session 记录用户登录状态

            res.status(200).json({
                err_code: 0,
                message: 'Ok'
            })
            
        })
    })

})

router.get('/logout', function (req, res) {  // 退出登录请求
    req.session.user = null  // 清除 session 标记
    res.redirect('/login')
})

module.exports = router
