var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema

var userSchema = new Schema({
  email: {  // 用户邮箱
    type: String,
    required: true
  },
  nickname: {  // 用户昵称
    type: String,
    required: true
  },
  password: {  // 用户密码
    type: String,
    required: true
  },
  created_time: {  // 创建时间
    type: Date,
    default: Date.now
  },
  last_modified_time: {  // 最后一次修改时间
    type: Date,
    default: Date.now
  },
  avatar: {  // 用户头像
    type: String,
    default: '/public/img/avatar-default.png'
  },
  bio: {  // 用户介绍
    type: String,
    default: ''
  },
  gender: {  // 用户性别
    type: Number,
    enum: [-1, 0, 1],
    default: -1
  },
  birthday: {  // 用户生日
    type: Date
  },
  status: {  // 用户权限
    type: Number,
    enum: [0, 1, 2],  // 0 没有权限限制、1 不可以评论、2 不可以登录
    default: 0
  }
})

module.exports = mongoose.model('User', userSchema)
