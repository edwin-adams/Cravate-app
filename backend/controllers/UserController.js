const router = require('express').Router();
const User = require('../models/user');
const Admin = require('../models/admin');
const Role = require('../models/role');
const Vendor = require('../models/vendor');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const TOKEN_KEY = 'DCMXIXvHBH';

router.post('/role/add', async function (req, res) {
    const body = req.body;
    const addRole = await Role.create({ roleName: body.role});
    res.send('Role Created');
});

router.get('/role/get', async function (req, res) {
    try {
    const roleID = req.body.id;
    const getRole = await Role.findOne({_id: roleID});
    if(getRole == null) {
        console.log('Role not found.');
        res.send('Role not found.');
    }
    else{
    res.send(getRole);
    }  
    } catch (error) {
        console.log('Error: ', error);
    }
    const adminExists = await Admin.findOne({username: username});
    if(!(adminExists == null)) {
        res.send({message: "Admin Exists"});
    }
    const addAdmin = await Admin.create({
        first_name,
        last_name,
        username,
        password: pass,
        role: "ADMIN"
    });
    const token = jwt.sign(
        {user_id: addAdmin._id, username, role: "ADMIN"},
        TOKEN_KEY,
        {
            expiresIn: "2h"
        }
    );

    addAdmin.token = token;

    res.send(addAdmin);
});

router.get('/roles/getall', async function (req, res) {
    const listRoles = await Role.find();
    console.log('Roles', listRoles);
    if(listRoles == '') {
        return res.send({message: 'No roles found'});
    };
    res.send(listRoles);
});

router.delete('/role/delete', async function (req, res) {
    const id = req.body._id;
    const role = await Role.findOne(id);
    const deleteRole = await Role.deleteOne(role);
    res.send('Role Deleted.');
});

router.post('/user/signUp', async function (req, res) {
    const { first_name, last_name, username, password } = req.body;
    const pass = bcrypt.hashSync(password, 10);
    if (!(username && password && first_name && last_name)) {
        res.status(400).send('Provide all details.');
    }
    const userExists = await User.findOne({username: username});
    if(!(userExists == null)) {
        res.send({message: "User Exists"});
    }
    const addUser = await User.create({
        first_name,
        last_name,
        username,
        password: pass,
        role: 'USER'
    });
    const token = jwt.sign(
        {user_id: addUser._id, username, role: 'USER'},
        TOKEN_KEY,
        {
            expiresIn: '2h'
        }
    );

    addUser.token = token;

    res.send(addUser);
});

router.get('/user/login', async function (req, res) {
    const { username, password } = req.body;
        const user = await User.findOne({username: username});
        const comparePassword = bcrypt.compareSync(password, user.password);
        if(comparePassword == true) {
            return res.send('Successfully logged in.');
        }
        else{
            return res.send('Incorrect Password.');
        }
});

router.get('/user/get', async function (req, res) {
    try{
        const user = req.body.username;
    const getUser = await User.findOne({username:user});
    if(getUser == null){
        console.log('User not found.');
        res.send('User not found.');
    }
    else{
    res.send(getUser);
    }
    }
    catch(error){
        console.log('Error: ',error);
    }
});

router.get('/users/getall', async function (req, res) {
    const listUsers = await User.find();
    console.log('Users', listUsers);
    if(listUsers == '') {
        return res.send({message: 'No users found'});
    };
    res.send(listUsers);
});

router.delete('/user/delete', async function(req,res){
    const usn = req.body.username;
    const user = await User.findOne({username: usn});
    if(user == null){
        res.send('No such user exists.');
    }
    else{
        const deleteUser = await User.deleteOne({username: usn});
        res.send('User Deleted.');
        
    }
});

router.post('/admin/signUp', async function (req, res) {
    const { first_name, last_name, username, password } = req.body;
    const pass = bcrypt.hashSync(password, 10);
    if (!(username && password && first_name && last_name)) {
        res.status(400).send('Provide all details.');
    }
    const addAdmin = await Admin.create({
        first_name,
        last_name,
        username,
        password: pass,
        role: 'ADMIN'
    });
    const token = jwt.sign(
        {user_id: addAdmin._id, username, role: 'ADMIN'},
        TOKEN_KEY,
        {
            expiresIn: '2h'
        }
    );

    addAdmin.token = token;
    res.send(addAdmin);
});

router.get('/admin/login', async function (req, res) {
    const { username, password } = req.body;
        const admin = await Admin.findOne({username: username});
        const comparePassword = bcrypt.compareSync(password, admin.password);
            if(comparePassword == true) {
                return res.send('Successfully logged in.');
            }
            else{
                return res.send('Incorrect Password.');
            }
       
});

router.get('/admin/get', async function (req, res) {
    try{
    const admin = req.body.firstname;
    const getAdmin = await User.findOne({first_name:admin});
    if(getAdmin == null){
        console.log('Admin not found.');
        res.send('Admin not found.');
    }
    else{
    res.send(getAdmin);
    }
    }
    catch(error){
        console.log('Error: ',error);
    }
      
});

router.get('/admins/getall', async function (req, res) {
    const listAdmins = await Admin.find();
    console.log('Admins', listAdmins);
    if(listAdmins == '') {
        return res.send({message: 'No admins found'});
    };
    res.send(listAdmins);
});

router.delete('/admin/delete', async function(req,res){
    const usn = req.body.username;
    const admin = await Admin.findOne({username: usn});
    if(admin == null){
        res.send('No such admin exists.');
    }
    else{
        const deleteAdmin = await Admin.deleteOne({username: usn});
        res.send('Admin Deleted.');
        
    }
});

router.post('/vendor/signUp', async function (req, res) {
    try{
        
        const { first_name, last_name, username, password } = req.body;
        const pass = bcrypt.hashSync(password, 10);
        if (!(username && password && first_name && last_name)) {
            res.status(400).send('Provide all details.');
        }
        const addVendor = await Vendor.create({
            first_name,
            last_name,
            username,
            password: pass,
            role: 'VENDOR'
        });
        const token = jwt.sign(
            {user_id: addVendor._id, username, role: 'VENDOR'},
            TOKEN_KEY,
            {
                expiresIn: '2h'
            }
        );
        addVendor.token = token;
        res.send(addVendor);
    }
    catch(Error){
        res.send('Error occured.');
    }
});

router.get('/vendor/login', async function (req, res) {
    const { username, password } = req.body;
        const vendor = await Vendor.findOne({username: username});
        const comparePassword = bcrypt.compareSync(password, vendor.password);
        if(comparePassword == true) {
            return res.send('Successfully logged in.');
        }
        return res.send('Incorrect Password.');
});

router.get('/vendor/get', async function (req, res) {
    try{
        const vendor = req.body.username;
        const getVendor = await Vendor.findOne({username:vendor});
        if(getVendor == null){
            res.send('Vendor not found.');
        }
        else{    
            res.send(getVendor);
        }

    }
    catch(error){
        console.log('Error:' ,error);
    }
});

router.get('/vendors/getall', async function (req, res) {
    const listVendors = await Vendor.find();
    console.log('Vendors', listVendors);
    if(listVendors == '') {
        return res.send({message: 'No vendors found'});
    }
    else{
        res.send(listVendors);
    }
});

router.delete('/vendor/delete', async function(req,res){
    const usn =req.body.username;
    const vendor = await Vendor.findOne({username: usn});
    if(vendor == null){
        res.send('No such vendor exists.');
    }
    else{
        const deleteVendor = await Vendor.deleteOne({username: usn});
        res.send('Vendor Deleted.');
    }
});

router.post('/truck/add', async function (req, res) {
    const body = req.body;
    const addTruck = await Truck.create({ truck_name: body.name});
    res.send('Truck Added.');
});

router.get('/truck/get', async function (req, res) {
    try{
        const truck = req.body.name;
        const getTruck = await Truck.findOne({truck_name: truck});
        if(getTruck == null){
            res.send('Truck not found.');
        }
        else{     
            res.send(getTruck);
        }
    }
    catch(error){
        console.log('Error:' ,error);
    }
});

router.get('/trucks/getall', async function (req, res) {
    const listTrucks = await Truck.find();
    console.log('Trucks', listTrucks);
    if(listTrucks == '') {
        return res.send({message: 'No trucks found'});
    };
    res.send(listTrucks);
});

module.exports = router;