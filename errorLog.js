const fs = require("fs");
//*************** error log in a file
function log(msg) {
  fs.writeFile("log.txt", `\n ${msg}`, function (err) {
    if (err) return console.log(err);
  });
}
module.exports = { log };
