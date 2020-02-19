var express = require('express')
var Users = require('./models/user')

var router = express.Router()

router.get('/', function (req, res) {
    res.render('index.html')
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
    // console.log(req.body)
    // 根据 邮箱 昵称 查询是否注册
    // 若已注册则相应
    // 若未注册则将数据保存到服务器，并相应
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
        new Users(body).save(function (err, data) {
            if (err) {
                return res.status(500).json({
                    err_code: 500,
                    message: 'Save users error!'
                })
            }
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
