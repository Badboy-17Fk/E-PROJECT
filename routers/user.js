const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const res = require('express/lib/response');
const jwt = require('jsonwebtoken');


/**
 * @description for security reasons
 * */
router.get(`/`, async (req,res) => {
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        
        res.status(500).json({success: false})
    }
    res.send(userList);
    console.log(userList);

})

//Add a New User in database
router.post('/registers', async (req,res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.zip,
        country: req.body.country
        
    })
    user = await user.save();
    if(!user){
        return res.status(404).send('the user cannot be created!')
    }
    res.send(user);
})

//getting all user
router.get('/', async (req,res)=> {
    const listuser = await User.find();

    if(!listuser) 
    {
        res.status(500).send({message: "There are no users"})

    }
    res.status(200).send(listuser)
})

//getting a particular user by :id of users
router.get('/:id', async (req,res) => {

    const user = await User.findById(req.params.id).select('-passwordHash');
    if(!user)
    {
        res.status(500).send({message: "Sorry there is no users"})
    }
    res.status(200).send(user)
    console.log(user);

})


//Updating a Category
router.put('/:id', async (req,res) => {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password)
    {
        newPassword = bcrypt.hashSync(req.body.password, 10);
    }else{
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country
        },{
            new: true
        }
    )
    if(!user)
       return res.status(400).json({message: 'the user you want to update does not exist'})
        
       res.status(201).send(user);
})

router.post( '/login', async (req,res)=> {
    const user = await User.findOne({ email: req.body.email})
    const secret = process.env.SECRET;

    if(!user) {
        return res.status(400).send({msg: "User not found"});
    }
    //check if the password exist
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            {expiresIn : '1d'}
        )
        res.status(200).send({user: user.email, token:token})
    }else {
        return res.status(200).send('Password is wrong');
    }


})
// Get Product Count
router.get(`/get/count`, async(req,res) => {
    
    const userCount = await User.countDocuments();
     if(!userCount)
        {
         res.status(500).json({success: false})
        }
    
        res.send({count: userCount});
        console.log(`The total User is`,userCount);
   
})

//Delete Users
router.delete('/:id', (req,res)=> {
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false, message: "user not found!"})
        }
    }).catch(err=> {
        return res.status(400).json({success: false, error: err})
    })
})

module.exports = router;