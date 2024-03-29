const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const auth = async (req, res, next) => {
   try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET); //{ _id: '63dd565694bebd93159c079d', iat: 1676823704 }
      const user = await User.findOne({
         _id: decodedToken._id,
         "tokens.token": token,
      });

      if (!user) {
         throw new Error();
      }

      //this token will be used for logout
      req.token = token;
      req.user = user;
      
      next();
   } catch (e) {
      //if not authenticated
      res.status(401).send({
         error: "User is not Authenticated. Please authenticate.",
      });
   }
};

module.exports = auth;
