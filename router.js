var express = require('express')
var Users = require('./models/user')
var md5 = require('blueimp-md5')

var router = express.Router()

router.get('/', function (req, res) {
    res.render('index.html', {
        user: req.session.user
    })
})

router.get('/login', function (req, res) {
    res.render('login.html')
})

router.post('/login', function (req, res) {
    
})

router.get('/register', function (req, res) {
    res.render('register.html')
})

router.post('/register', function (req, res) {
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
            return res.stutus(500).json({
                success: false, 
                message: '服务端错误'
            })
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
                return res.status(500).json({
                    err_code: 500,
                    message: 'Save users error!'
                })
            }

            req.session.user = data  // 注册成功后，使用 Session 记录用户登录状态

            res.status(200).json({
                err_code: 0,
                message: 'Ok'            
            })
            
        })
    })

})

router.post('/logout', function (req, res) {
    
})

module.exports = router
