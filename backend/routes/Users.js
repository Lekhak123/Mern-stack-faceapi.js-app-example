const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require('bcrypt');
router.post("/register", async(req, res) => {
    console.log("a")
    try {
        //get username, email, and password from request
        const {username, email, password} = req?.body;

        //hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //save the data to mongodb
        const newUser = new User({username, email, password: hashedPassword});

        const user = await newUser.save();

        //return mongo collection id as confirmation
        res.status(200).json(user._id);
        return;

    } catch (err) {
        res.status(500).json(err);
        return;
    }
})

router.post("/login", async(req, res) => {

    //receive username and password
    try {
        const {username, password} = req?.body;

        //search for the first match in mongodb
        let user = await User.findOne({username: username});
        if (!user) {
            res.status(500).json("Wrong username or password");
            return;
        }

        //validate password

        let validPassword = bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(500).json("Invalid username or password");
            return;

        }

        //send the mongo collection id and username after confirmation
        res.status(200).json({_id: user._id, username: username});
        user = "";
        username = "";
        password = "";
        validPassword = "";
        return;

    } catch (err) {
        res.status(500).json(err);
        return;
    }

})

module.exports = router;