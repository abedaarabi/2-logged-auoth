const express = require("express");
const app = express();
const router = express.Router();
const dotenv = require("dotenv");
const result = dotenv.config();
const axios = require("axios");
app.use(express.json());
app.use(express.static("client"));
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const { connect, insertData, getUserData } = require("./schema");
const { tokenBody, bim360Users, PORT, accountId, auothUrl } = process.env;

function data() {
  app.get("/users/", async (req, res) => {
    try {
      const usersData = await getUserData();
      res.send(usersData);
    } catch (error) {
      console.log(error);
    }
  });
}
data();

let token;
async function getToken() {
  // dummy request to check if the current token is valid

  try {
    await getUsers(token, accountId);

    return token;
  } catch (e) {
    console.log("invalid token");

    const response = await axios({
      url: auothUrl,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: tokenBody,
    });

    const accessToken = response.data.access_token;
    token = accessToken;
    return accessToken;
  }
}

async function getUsers(token, account_id) {
  const response = await axios(`${bim360Users}/${account_id}/users?limit=100`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {
      limit: 100, // ask younes
      //https://forge.autodesk.com/en/docs/bim360/v1/reference/http/users-GET/
    },
  });
  return response.data;
}
let myarr = [];
let myarr01 = [];
async function userMetaData() {
  token = token || (await getToken());
  console.log(token);
  const users = await getUsers(token, accountId);

  // myarr01.push(users);
  // console.log(users[2]);

  return users.map((user) => {
    usersData = {
      name: user.name,
      email: user.email,
      job_title: user.job_title,
      last_sign_in: user.last_sign_in,
      city: user.city,
      country: user.country,
      role: user.role,
      created_at: user.created_at,

      status: user.status,
      phone: user.phone,
      id: user.id,
    };
    myarr.push(usersData);
    // console.log(myarr);
    insertData(myarr);
  });
}

userMetaData();

/********** Server *************/

function server(PORT) {
  app.listen(PORT, console.log(`PORT IS RUNNING ON ${PORT}` || 9090));
}
connect(server(PORT));
