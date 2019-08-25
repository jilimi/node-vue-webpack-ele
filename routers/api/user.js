const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const gravatar = require('gravatar');
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

router.get("/test", (req, res)=>{
    res.json({msg:"login works"});
})

router.post('/register', (req, res)=>{
    // console.log(req.body);
    User.findOne({email: req.body.email})
    .then((user)=>{
        if(user){
            res.status(400).json("邮箱已注册！");
        } else{
            let avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});

            let newUser = new User({
                email: req.body.email,
                name: req.body.name,
                password: req.body.password,
                avatar,
                identity: req.body.identity
            })

            bcrypt.hash(newUser.password, 10, function(err, hash) {
                if(err) {
                    res.status(400).json(err.errors);
                    throw err;
                }
                newUser.password = hash;
                newUser.save()
                .then(user => {
                    res.json(user);
                })
                .catch(err => {
                    res.status(400).json(err);
                    console.log(err);
                    throw err;
                })
            });
    
            
        }                

    })
})

router.post('/login', (req, res)=>{
    let password = req.body.password;
    let email = req.body.email;

    User.findOne({email: email})
    .then(user=>{
        if(!user){
            return res.status(404).json("账号不存在")
        }
        
        bcrypt.compare(password, user.password)
        .then(isMatch=>{
            if(isMatch){
                let rule = {id: user.id,
                    name: user.name,
                    avatar: user.avatar,
                    identity: user.identity};
                jwt.sign(rule, keys.secretOrKey, { expiresIn: 10}, (err, token) => {
                    if(err) throw err;
                        return res.json({success: true, token: 'Bearer ' + token});
                    }
                );
            } else{
                return res.status(400).json("密码错误！");
            }
        })
    })
    .catch(err=>{
        return res.status(500).json("服务器错误！");
    })

})

router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
      });
    }
  );

module.exports = router;