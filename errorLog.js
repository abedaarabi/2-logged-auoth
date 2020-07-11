const fs = require("fs");
//*************** error log in a file
function log(msg) {
  fs.writeFile("log.txt", `\n ${msg}`, function (err) {
    if (err) return console.log(err);
    console.log("Hello World ");
  });
}
module.exports = { log };
