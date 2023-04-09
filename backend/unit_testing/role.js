const Role = require("../models/role");

async function addRole(req, res) {
  const body = req.body;
  const findRoles = await Role.findOne({ roleName: body.role });
  if(findRoles !== null) {
    res.send("Role Already Exists");
    return;
  }
  await Role.create({ roleName: body.role });
  res.send("Role Created");
}

async function getRole(req, res) {
    try {
      const roleID = req.body.id;
      const getRole = await Role.findOne({ _id: roleID });
      if (getRole == null) {
        res.send("Role not found.");
      } else {
        res.send(getRole);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
}

async function getAllRoles(req, res) {
    try {
      const listRoles = await Role.find();
      if (listRoles.length === 0) {
        res.send({ message: "No roles found" });
      } else {
        res.send(listRoles);
      }
    } catch (error) {
      console.log("Error: ", error);
      res.send({ message: "An error occurred while fetching roles" });
    }
}

async function deleteRole(req, res) {
    const id = req.body._id;
    const role = await Role.findOne(id);
    if (role == null) {
      res.send("Role Not found");
      return;
    }
    const result = await Role.deleteOne(role);
    if (result.n === 1) {
      res.send("Role Deleted.");
    } else {
      res.send("Failed to delete role.");
    }
  }

module.exports = {
  addRole, getRole, getAllRoles, deleteRole
};