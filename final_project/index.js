const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true })
);

app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers.authorization;
  
    // Check if the token is present
    if (token) {
      try {
        // Verify the token
        const decodedToken = jwt.verify(token, "your_secret_key_here");
  
        // Add the decoded token to the request object
        req.user = decodedToken;
  
        // Continue to the next middleware
        return next();
      } catch (err) {
        // Invalid token, send an error response
        return res.status(401).json({ error: "Invalid token" });
      }
    } else {
      // Token is not provided, send an error response
      return res.status(401).json({ error: "Token not provided" });
    }
  });

const PORT = 3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));

