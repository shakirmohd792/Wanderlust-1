const User = require('../model/user.js');


module.exports.signup = async(req, res)=>{
 let {email, username, password} = req.body;
 let newUser = new User({email, username});
 let registeredUser = await User.register(newUser, password);
 req.login(registeredUser,(err)=>{
 if(err){
         return next(err);
}
      res.json(registeredUser);
})};

module.exports.logout = (req, res , next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    })
    res.json({logout:"you are logged out"})
}

