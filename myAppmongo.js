const UserService = require("../Services/userService");

class userController{
    async createUserfunc(req, res){
       try{
        const {name,email,phone} = req.body;
        const saveuser = await UserService.createUser(name, email, phone);
        res.json(saveuser);
       }
       catch (error) {
        // if (error.validationErrors) {
        //   // Send validation errors to the frontend
        //   return res.status(400).json({ errors: error.validationErrors });
        // }
        res.status(500).json({ error: error.message })
       }
    }
    async getAllUsers(req,res){
        try{
            const allusers = await UserService.getAllUsers();
            res.json(allusers);
        }
        catch(error){
         res.status(500).json({ error: error.message })
        }
    }
    async getUserById(req,res){
        const userId = req.params.id
        try{
          const user = await UserService.getUserById(userId);
          if(!user)
             return res.status(404).json({ error : "User not found" })
          res.json(user);
        } 
        catch(error){
         res.status(500).json({ error : error.message })
        }
    }
    async updateUser(req,res){
        
        const userId = req.params.id
        const updatedata =req.body;

        try {
          const updateduser = await UserService.updateUser(userId, updatedata)
          if(!updateduser)
            return res.status(404).json({ error : "User not found" })
          res.json(updateduser);
          }

        catch(error){
          res.status(500).json({ error: error.message })
        }
    }
  async deleteUser(req,res){
    const userId = req.params.id
    try{
      const deleteduser = await UserService.deleteUser(userId)
      if(!deleteduser)
        return res.status(404).json({ error : "User not found" })
      res.json({ message : "User deleted succesffully", user:deleteduser});
    }
    catch(error){
      res.status(500).json({ error: error.message })
    }
  }
};

module.exports = new userController();