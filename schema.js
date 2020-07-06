const dotenv = require("dotenv");
const result = dotenv.config();
const mysql = require("mysql");

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

function insertData(users) {
  con.query(
    "delete from userInfo;",

    function (err, result) {
      // console.log(result);
      insert();
    }
  );
  function insert() {
    users.map((user) => {
      //   console.log(users);

      con.query("INSERT INTO userInfo SET ?", user, function (err, result) {
        // console.log(err, result);
      });
    });
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
