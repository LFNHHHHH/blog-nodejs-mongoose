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
    // 获取用户传递来的数据
    var body = req.body

    // 判断数据是否存在，邮箱密码正确则登录成功
    Users.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, function (err, user) {
        // 查询失败
        if (err) {  
            return next(err)
        }
        // 数据不存在
        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invalid.'
            })
        }

        // 用户登录成功，通过 session 记录登录状态
        req.session.user = user  

        // 响应
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

    // 根据邮箱密码查询数据库
    Users.findOne({
        $or: [{
                email: body.email
            },
            {
                nickname: body.nickname
            }
        ]
    }, function (err, data) {
        // 查询失败
        if (err) {
            return next(err)
        }

        // 邮箱 或 昵称 已存在
        if (data) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or nickname aleady exists!'
            })
        }

        // 邮箱和昵称没问题
        // 对用户密码进行 md5 加密
        body.password = md5(md5(body.password))  

        // 将用户数据保存到数据库
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
    // 清除 session 标记
    req.session.user = null
    res.redirect('/login')
})

router.get('/settings/admin', function(req, res) {  // 用户密码设置
    res.render('./settings/admin.html', {
        user: req.session.user
    })
})

router.post('/settings/admin', function(req, res, next) {  // 用户密码设置请求提交
    // 用户传递过来的密码
    var password = md5(md5(req.body.password))  

    // 判断新旧密码是否相等
    if (req.session.user.password !== password) {  
        return res.status(200).json({
            err_code: 0,
            message: 'wrong password'
        })
    }

    // 判断两次输入的密码是否相等
    if (req.body.newpassword !== req.body.newpassword2) {  
        return res.status(200).json({
            err_code: 1,
            message: 'Inconsistent passwords twice'
        })
    }

    // 根据邮箱，更新密码
    Users.update({'email': req.session.user.email}, {'password': md5(md5(req.body.newpassword))}, function (err, ret) {
        if (err) {
            return next(err)
        }
        return res.status(200).json({
            err_code: 3,
            message: 'Ok'
        })
    })

    // 修改密码后，清除 session 标记，在客户端跳转到登录页
    req.session.user = null  
})

router.get('/settings/profile', function(req, res, next) {  // 用户信息页面渲染
    res.render('./settings/profile.html', {
        user: req.session.user
    })
})

router.post('/settings/profile', function(req, res, next) {  // 用户信息设置提交
    var user = req.session.user

    // 接收用户设置的新数据
    var body = req.body

    // 设置
    for (const key in body) {
        user[key] = body[key]
    }

    // 保存到服务器
    Users.findOneAndUpdate({
        id: user.id
    }, user, function (err, ret) {
        if (err) {
            return next(err)
        }
        res.status(200).json({
            err_code: 0,
            message: 'ok'
        })
    })
    
})

router.get('/topics/new', function(req, res, next) {   // 发表文章页面渲染
    res.render('./topic/new.html', {
        user: req.session.user
    })
})

module.exports = router
