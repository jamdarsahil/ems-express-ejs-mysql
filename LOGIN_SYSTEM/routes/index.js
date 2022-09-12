const { query } = require('express');
var express = require('express');
const { res } = require('../app');
var router = express.Router();
var connectDB = require('./database')

/* INDEX ROUTES */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express', session: req.session });
});


/* ============================== ADMIN ROUTES ============================== */
/* ------------ Admin signup Page ------------ */
router.get('/admin-login/signup', function(req, res, next) {
    res.render('admin_register', { title: 'Express' });
});

/* ------------ Admin signup ------------ */
router.post('/admin-login/signup', function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    connectDB.query("INSERT INTO admin_login VALUES(default,?,?,?)", [
            username, password, ''
        ],
        (err) => {
            if (err) {
                console.log("Register Failed !!! ", err);
                // res.redirect('/');
            } else {
                console.log("Registration Successful");
                res.redirect('/admin-login');
            }
        })
});

/* ------------ Admin Login Page ------------ */
router.get('/admin-login', function(req, res, next) {
    res.render('admin_login', { title: 'Express', session: req.session });
});

/* ------------ Admin Login ------------ */
router.post('/admin-login', function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
        getUserName = ` SELECT * FROM admin_login 
        WHERE admin_email = "${username}"`;
        connectDB.query(getUserName, (err, data) => {
            if (err) {
                console.log("Login failed", err)
            }
            if (data.length > 0) {
                for (var count = 0; count < data.length; count++) {
                    if (data[count].admin_password == password) {
                        req.session.admin_id = data[count].admin_id;
                        console.log("login success")
                        res.render('admin')
                    } else {
                        res.send('Incorrect Password');
                    }
                }
            } else {
                res.send('Incorrect Email Address');
            }
            res.end();

        })
    } else {
        res.send('Please Enter Email Address and Password Details');
        res.end();
    }
});


/* ------------ Show Employee ------------ */
router.get('/admin-login/show-emp', function(req, res, next) {
    console.log("inside show emp")
    connectDB.query("SELECT * FROM emp", (err, result) => {
        if (err) {
            console.log("Unable to find employees")
        }
        res.render('show_emp', { data: result })
    })
});

/* ------------ Add Employee ------------ */
router.get('/admin-login/show-emp/add-emp', function(req, res, next) {
    res.render('add_emp');
});

router.post('/admin-login/show-emp/add-emp', (req, res, next) => {
    var name = req.body.name;
    var email = req.body.email;
    var gender = req.body.gender;
    var phone = req.body.phone;
    var department = req.body.department;
    var salary = req.body.salary;
    var password = req.body.password;

    connectDB.query("INSERT INTO emp VALUES(default,?,?,?,?,?,?,?,default)", [
            name, email, gender, phone, department, salary, password,
        ],
        (err) => {
            if (err) {
                console.log("Record Insertion failed : ", err);
                res.redirect('/admin-login/show-emp');
            } else {
                console.log("Record Inserted");
                res.redirect('/admin-login/show-emp');
            }
        })

});

/* ------------ Search Employee ------------ */
router.post('/admin-login/show-emp', (req, res, next) => {
    connectDB.query("SELECT * FROM emp WHERE empId=?", [req.body.empId],
        (err, result) => {
            if (err) {
                res.send("Unable to load employees")
            } else {
                if (result != null) {
                    res.render("show_emp", { data: result })
                } else {
                    res.send("Employees not found")
                }

            }

        }
    )
})

/* ------------ Update Employee ------------ */
router.get('/admin-login/show-emp/update-emp/:empId', (req, res, next) => {
    connectDB.query("SELECT * FROM emp WHERE empId=?", [req.params.empId],
        (err, result) => {
            if (err) {
                console.log("Employee not selected : ", err);
                res.redirect('/');
            } else {
                console.log("Employee selected");
                res.render('update_emp', { data: result })
            }
        })

});

router.post('/admin-login/show-emp/update-emp/:empId', (req, res, next) => {
    console.log("A")
    connectDB.query("UPDATE emp SET ? WHERE empId=?", [req.body, req.params.empId],
        (err, result) => {
            console.log("Employee");
            if (err) {
                console.log("Employee not Updated : ", err);
                res.redirect('/admin-login/show-emp');
            } else {
                console.log("Employee details updated");
                res.redirect('/admin-login/show-emp');
            }
        })

});

/* ------------ Delete Employee ------------ */

router.get('/admin-login/show-emp/delete-emp/:empId', (req, res, next) => {

    connectDB.query("DELETE FROM emp WHERE empId=?", [req.params.empId],
        (err, result) => {
            if (err) {
                console.log("Employee not deleted : ", err);
                res.redirect('/admin-login/show-emp');
            } else {
                console.log("Employee delted");
                res.redirect('/admin-login/show-emp');
            }
        })
});



/* ============================== Employee ROUTES ============================== */

//Login Page
router.get('/employee-login', function(req, res, next) {
    res.render('employee_login', { title: 'Express', session: req.session });
});

//Login 
router.post('/employee-login', function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    if (username && password) {
        getUserName = ` SELECT * FROM emp 
        WHERE empEmail = "${username}"`;

        connectDB.query(getUserName, (err, data) => {
            if (err) {}
            if (data.length > 0) {
                for (var count = 0; count < data.length; count++) {
                    if (data[count].empPassword == password) {
                        req.session.empId = data[count].empId;
                        // res.send("login success")
                        res.render('employee')
                    } else {
                        res.send('Incorrect Password');
                    }
                }
            } else {
                res.send('Incorrect Email Address');
            }
            res.end();

        })
    } else {
        res.send('Please Enter Email Address and Password Details');
        res.end();
    }
});

//Employee details
router.get('/employee-login/edit-emp', function(req, res, next) {
    const empId = ''
    console.log("inside edit")
    connectDB.query("SELECT * FROM emp WHERE empId=?", [req.session.empId],
        (err, result) => {
            if (err) {
                res.send("Unable to load employees")
            } else {
                if (result != null) {
                    res.render("employee_data", { data: result })
                } else {
                    res.send("Employees not found")
                }
            }
        }
    )
});


//To Register page
router.get('/employee-login/register', function(req, res, next) {
    res.render('employee_register');
});

// registration 
router.post('/employee-login/register', function(req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var gender = req.body.gender;
    var phone = req.body.phone;
    var department = req.body.department;
    var salary = req.body.salary;
    var password = req.body.password;

    connectDB.query("INSERT INTO emp VALUES(default,?,?,?,?,?,?,?,default)", [
            name, email, gender, phone, department, salary, password,
        ],
        (err) => {
            if (err) {
                console.log("Record Insertion failed : ", err);
                res.redirect('/');
            } else {
                console.log("Record Inserted");
                res.send("resgister");
            }
        })

});


module.exports = router;