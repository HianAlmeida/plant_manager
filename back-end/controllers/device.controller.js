const Device = require("../models/device.model.js");

const createDevice = async (req, res) => {
    try{
        const { user_id,  name} = req.params;
        const user = await find_user(user_id);
        console.log(user)
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message: error.message}) //change error message
    }
}


const find_user = async (user_id) => {
    try{
        const user = await User.findById(user_id);
        return user
    }catch(error){
        return "user not found"
    }
}

module.exports = {
    createDevice
};

