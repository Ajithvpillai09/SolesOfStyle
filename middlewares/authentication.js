
let userAuth = (req, res, next) => {
    try{
        if (req.session.userLoggedIn) {
            res.redirect('/home')
        } else {
            next();
        }

    }catch(e){
        console.log(e);
    }
}

let guestAuth = (req, res, next) => {
    try{
        if (req.session.userLoggedIn) {
            next();
        } else {
            res.redirect('/login')
        }

    }catch(e){
        console.log(e);
    }
   
}

let authAdmin = (req, res, next) => {
    try{
        if (req.session.adminLoggedIn) {
            next();
        }
        else {
            res.redirect('/admin');
        }

    }catch(e){
        console.log(e);
    }
   
}

module.exports = {
    userAuth,
    guestAuth,
    authAdmin
}

