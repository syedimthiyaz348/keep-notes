const express = require("express");
require("./mongo");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const user = require("./user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const notes = require("./notes");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/* ************************************ */

/* API for getting Notes Data */
app.get("/notes", async (req, res) => {
  const authHeader = req.headers["authorization"];
  let jwtToken;
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
    jwt.verify(jwtToken, "SYED_IMTHIYAZ", async (error, payload) => {
      if (error) {
        res.send("Invalid Token");
      } else {
        const usernote = await notes.find({});
        res.send(usernote);
      }
    });
  } else {
    res.status(401);
    res.send("<h1>You Are Not Authorised</h1>");
  }
});

/* ************************************ */

/* API for adding Notes Data */

app.post("/addnote", async (req, res) => {
  const userNoteDetails = {
    title: req.body.title,
    content: req.body.content,
    status: "created",
  };
  const authHeader = req.headers["authorization"];
  let jwtToken;
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
    jwt.verify(jwtToken, "SYED_IMTHIYAZ", async (error, payload) => {
      if (error) {
        res.send("Invalid Token");
      } else {
        const usernote = await notes(userNoteDetails);
        const result = await usernote.save();
        res.send(result);
      }
    });
  } else {
    res.status(401);
    res.send("<h1>You Are Not Authorised</h1>");
  }
});

/* ************************************ */

/* API for updating Notes Data */

app.put("/updatenote/:id", async (req, res) => {
  let id = req.params.id;
  const authHeader = req.headers["authorization"];
  let jwtToken;
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
    jwt.verify(jwtToken, "SYED_IMTHIYAZ", async (error, payload) => {
      if (error) {
        res.send("Invalid Token");
      } else {
        let toUpdateData = await notes.updateOne(
          { _id: id },
          {
            $set: req.body,
          }
        );
        res.send({msg : "Successfully Updated"});
      }
    });
  } else {
    res.status(401);
    res.send("<h1>You Are Not Authorised</h1>");
  }
});

/* ************************************ */

/* API for deleting notes Data */

app.delete("/deletenote/:id", async (req, res) => {
  let id = req.params.id;
  const authHeader = req.headers["authorization"];
  let jwtToken;
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
    jwt.verify(jwtToken, "SYED_IMTHIYAZ", async (error, payload) => {
      if (error) {
        res.send("Invalid Token");
      } else {
        let toDeleteData = await notes.deleteOne({ _id: id });
        res.send({msg : "Successfully Deleted"});
      }
    });
  } else {
    res.status(401);
    res.send("<h1>You Are Not Authorised</h1>");
  }
});

/* API for getting users Data */

app.get("/users", async (req, res) => {
  const authHeader = req.headers["authorization"];
  let jwtToken;
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
    jwt.verify(jwtToken, "SYED_IMTHIYAZ", async (error, payload) => {
      if (error) {
        res.send("Invalid Token");
      } else {
        res.send({username : payload });
      }
    });
  } else {
    res.status(401);
    res.send("<h1>You Are Not Authorised</h1>");
  }
});

/* ************************************ */

/* API for for signup user */

app.post("/signup", async (req, res) => {
  let usersData = await user.find({ username: req.body.username });
  if (usersData.length !== 0) {
    res.status(400);
    res.send("User Already Exists");
  } else {
    const payload = req.body.username;
    const secretCode = "SYED_IMTHIYAZ";
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);
    const token = jwt.sign(payload, secretCode);
    const result = {
      username: req.body.username,
      password: encryptedPassword,
      jwtToken: token,
    };
    const userData = await user(result);
    const saveData = await userData.save();
    res.send({ msg: "Account Created Successfully" });
    res.send({ token });
  }
});

/* ************************************ */

/* API for Login user */

app.post("/login", async (req, res) => {
  let username = await user.find({ username: req.body.username });
  let userCredentials;
  if (username.length !== 0) {
    userCredentials = username[0];
    const verifyPassword = await bcrypt.compare(
      req.body.password,
      userCredentials.password
    );
    if (verifyPassword === true) {
      res.send({ msg: "Login Success" });
      res.send({token: userCredentials.jwtToken})
    } else {
      res.send({ error_msg: "Password Not Matched" });
    }
  } else {
    res.send({ error_msg: "user not found" });
  }
});

/* ************************************ */

app.listen(3001, (req, res) => {
  console.log("Server Started");
});
