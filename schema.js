const dotenv = require("dotenv");
const result = dotenv.config();
const mysql = require("mysql");
const { resolve } = require("path");
const { rejects } = require("assert");

const { log } = require("./errorLog");
const { sqlPassword } = process.env;

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: sqlPassword,
  database: "bim360_users",
  multipleStatements: true,
});

const connect = function () {
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected MySQL Database!");

    /***************** CREATE TABLE********************* */

    // var sql = "CREATE TABLE user";
    // con.query(sql, function (err, result) {
    //   if (err) throw err;
    //   console.log("Table created");
    // });
    // console.log(con);
  });
};

function insertData(users, lastSignIns) {
  return new Promise((resolve, rejects) => {
    con.query(
      "delete from userInfo;",

      function (err, result) {
        // console.log(result);
        insert().then(() => resolve());
      }
    );
  });

  async function insert() {
    await Promise.all(
      users.map((user) => {
        //   console.log(users);
        return new Promise((resolve, reject) => {
          con.query("INSERT INTO userInfo SET ?", user, function (err, result) {
            // console.log(err, result);
            if (err) {
              log(err);
              resolve();
              // console.log(err);
            } else {
              resolve();
            }
          });
        });
      })
    );

    await insertTwo();
  }

  function insertTwo() {
    return Promise.all(
      lastSignIns.map((lastSignIn) => {
        return new Promise((resolve, rejects) => {
          con.query("INSERT INTO userSignIns SET ?", lastSignIn, function (
            err,
            result
          ) {
            if (err) {
              log(err.toString());
              resolve();
            } else {
              resolve();
              console.log(result);
            }
          });
        });
      })
    );
  }
}
async function getUserData() {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM userInfo ", function (err, result, fields) {
      if (!err) {
        resolve(result);
      } else {
        reject(err);
      }
      // console.log(fields);
    });
  });
}
module.exports = { connect, insertData, getUserData };
