import { Router } from "express";
import User from "../models/User.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fetchuser from '../middleware/fetchuser.js'

const router = Router();
const JWT_SECRET = "Harryisagoodb$oy";

//Route 1: Create a User using :POST "/api/auth/createuser".Doesn't Require Auth

router.post(
  "/createuser",
  [
    body("email", "Please enter valid email").isEmail(),
    body("name", "Please enter valid name").isLength({ min: 3 }),
    body("password", "Please enter password of minimum length 8").isLength({
      min: 8,
    }),
  ],

  async (req, res) => {
    let success = false;
    //If any errors occurs,Return bad request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        let success = false;
        return res
          .status(400)
          .json({success, error: "Sorry user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10); //--
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET,);
      success = true;
      res.json({success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error occurs");
    }
  }
);

//Route 2: Authenticate a User using: POST "/api/auth/login". login not required
router.post(
  "/login",
  [
    body("email", "Please enter valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user =await User.findOne({ email });
      if (!user) {
        success=false;
        return res.status(400).json({ error: "Please try to login with correct Credentials" });
      }

      const passwordCompare =await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false
        return res.status(400).json({error: "Please try to login with correct Credentials" });
      }

      const data = {
        user: {
          id: user.id,
        }
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success=true
      res.json({ success,authtoken });
    } catch (error) {
        console.error(error.message);
      res.status(500).send("Internal Server error occurs");
    }
  }
);
//Route 3: Get LoggedIn user details using :POST "/api/auth/getuser".---Login Reguired
router.post(  
"/getuser",fetchuser,
  async (req, res) => {
try {
    const userId=req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
} catch (error) {
     console.error(error.message);
      res.status(500).send("Internal Server error occurs");
}
})

export default router;
