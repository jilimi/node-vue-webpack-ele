const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const passport = require("passport");
const app = express();

const port = process.env.PORT || 5000;
const db = require("./config/keys").mongoURI;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(passport.initialize());

const users = require("./routers/api/user");
const profiles = require("./routers/api/profile");



app.get('/', (req, res) => {
    res.send('hello world!');
})

mongoose.connect(db)
.then((res)=>{
    console.log("connect mongodb successful!");
    // console.log(res);
}).catch((err)=>{
    console.log(err);
})

app.use("/api/users", users);
app.use("/api/profiles", profiles)

require("./config/passport")(passport);

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})

