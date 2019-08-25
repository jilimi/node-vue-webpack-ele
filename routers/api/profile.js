const express = require("express");
const router = express.Router();
const passport = require("passport");
const Profile = require("../../models/Profile");

router.get('/test', (req,res)=>{
    res.json({msg: "profile works"});
});

//@router POST api/profiles/add
//@desc 创建信息接口
//@access Private
router.post("/add", passport.authenticate('jwt', {session: false}), (req, res)=>{
    new Profile(req.body).save().then(profile=> {
        res.json(profile);
    })
});

router.post("/edit/:id", passport.authenticate('jwt', {session: false}), (req, res)=>{
    Profile.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, {new: true})
    .then(profile=>{
        if(profile)
            return res.json(profile);
        return res.status(404).json("编辑失败，没有发现!");
    }).catch(err=> res.status(500).json("编辑失败"));
});

router.get("/delete/:id", passport.authenticate('jwt', {session: false}), (req, res)=>{
    Profile.findOneAndRemove({_id: req.params.id}).then(profile=>{
        if(profile)
            return profile.save().then(profile=> res.json(profile));
        return res.status(404).json("删除失败");
    }).catch(err=>req.status(500).json("删除失败"));
})

router.get("/",passport.authenticate('jwt', {session: false}), (req, res)=>{
    Profile.find().then(profile=>{
        if(!profile){
            return res.status(404).json("没有任何内容");
        }
        res.json(profile);
    }).catch(err=>res.status(404).json(err));
})

router.get("/:id", passport.authenticate('jwt', {session: false}), (req, res)=>{
    Profile.findOne({_id: req.params.id}).then(profile=>{
        if(!profile){
            return res.status(404).json("没有任何内容");
        }
        res.json(profile);
    }).catch(err=>res.status(404).json(err));
})


module.exports = router;