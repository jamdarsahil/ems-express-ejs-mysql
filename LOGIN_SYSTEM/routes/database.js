const mysql = require('mysql')

const connectDB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "printPack"
});

connectDB.connect((err) => {
    if (err) {
        console.log("Connection Failed")
        throw err;
    } else {
        console.log('MySQL Database is connected Successfully');
    }
});

module.exports = connectDB