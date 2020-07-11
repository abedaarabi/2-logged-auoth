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
const { log } = require("./errorLog");
const util = require("util");

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

async function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

async function run() {
  while (true) {
    let token;
    async function getToken() {
      // dummy request to check if the current token is valid

      try {
        await getUsers(token, accountId);

        return token;
      } catch (e) {
        log(e.toString());
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

    async function getUsers(token, account_id, limit = 100, offset = 0) {
      console.log(
        `${bim360Users}/${account_id}/users?limit=${limit}&offset=${offset}`
      );
      const response = await axios(
        `${bim360Users}/${account_id}/users?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          //https://forge.autodesk.com/en/docs/bim360/v1/reference/http/users-GET/
        }
      );

      return response.data;
    }

    async function userMetaData() {
      token = token || (await getToken());

      console.log(token);

      let offset = 0;
      let limit = 100;

      let allUsers = [];

      while (true) {
        console.log(offset, limit);
        const users = await getUsers(token, accountId, limit, offset);
        if (users.length === 0) break;
        else {
          offset = offset + limit;
          allUsers = allUsers.concat(users);
        }
      }

      console.log(allUsers.length);

      // myarr01.push(users);
      // console.log(users[2]);

      const users = allUsers.map((user) => {
        return {
          name: user.name,
          email: user.email,
          job_title: user.job_title,
          city: user.city,
          country: user.country,
          role: user.role,
          created_at: user.created_at,

          status: user.status,
          phone: user.phone,
          id: user.id,
        };
      });

      const lastSignIns = allUsers
        .map((user) => {
          return {
            userId: user.id,
            last_sign_in: user.last_sign_in,
          };
        })
        .filter((x) => {
          return x.last_sign_in;
        });

      await insertData(users, lastSignIns);
    }
    await userMetaData();
    await delay(15 * 1000);
  }
}
run();
/********** Server *************/

function server(PORT) {
  app.listen(PORT, console.log(`PORT IS RUNNING ON ${PORT}` || 9090));
}
connect(server(PORT));
const arr = [1, 2, 3, 4, 5, 6];

// const myarr = arr.map(function name(e, index) {
//   if (index == 0) {
//     return arr[index + 1];
//   } else if (index == arr.length - 1) {
//     return arr[index - 1];
//   } else {
//     return arr[index + 1] * [index - 1];
//   }
// });
// console.log(myarr);//
