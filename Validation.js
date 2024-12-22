const validator = require('./helper/validator');

module.exports = (type = "") => {
    return async(req, res, next) => {
        const set_validator = {
            createForm: async(req)=>{
                await validator.isValidCreateForm(req.body)
            },
            redirectForm: async(req)=>{
                await validator.isValidRedirectForm(req.params)
            }
        }

        try{
            await set_validator[type](req);
            next()
        }catch(err){
            res.status(400).send(`Validation Error: ${err.details[0].message}`)
        }
    }
}