const { execService } = require('../services/systemService');


const execController = async (req, res) => {
   const { cmd } = req.query;

   if(!cmd) {
        return res.status(400).json({error: "No command specified"});
   }
   try{
        const result = await execService(cmd)
        return res.status(200).json({output: result});

   }catch(err){
        return res.status(500).json({error: err.message});

   };
};


module.exports = { execController }