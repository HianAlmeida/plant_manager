const User = require("../models/user.model.js");

const getUsers = async (req, res) => {
    try{
        const user = await User.find({});
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message: error.message}) //change error message
    }
}

const getUser = async (req, res) => {
    try{
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message: error.message}) //change error message
    }
}

const createUser = async (req, res) => {
    try{
        const user = await User.create(req.body);
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({message: error.message}) //change error message
    }
}

const updateUser = async (req, res) => {
    try{
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body);

        if (!user){
            return res.status(400).json({message: "User not found"});
        }
        const updatedUser = await User.findById(id)
        res.status(200).json(updatedUser);
    }catch(error){
        res.status(500).json({message: error.message}) //change error message
    }
}

const deleteUser = async (req, res) => {
    try{
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user){
            return res.status(400).json({message: "User not found"});
        }
        const updatedUser = await User.findById(id)
        res.status(200).json({message: "User deleted"});
    }catch(error){
        res.status(500).json({message: error.message}) //change error message
    }
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};

