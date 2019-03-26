const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 4000;
const db = require('./db/dbConfig');
const user = db.users;
const userPhotos = db.usersprofileimages;
const assignmentTopics = db.assignment_topics;
const assignedTasks = db.assigned_tasks;
const taskDocuments = db.tasks_documentations;

app.use(bodyParser.json({
  limit: '50mb',
  extended: true
}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

let data = {
  "data": "",
  "error": false,
  "message": "",
  "status": ""
};

const multer = require('multer');
const uuidv4 = require('uuid/v4');
const path = require('path');
const mkdirp = require('mkdirp');
const mv = require('mv');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const actionUrl = req.originalUrl;
    if (actionUrl === '/api/uploadTaskDocument') {
      cb(null, './src/assets/uploads/taskdocuments');
      mkdirp('./src/assets/uploads/taskdocuments', function (err) {
        if (err) data["message"] = "Folder is not creating";
      });
    } else {
      cb(null, './src/assets/uploads/userprofile');
      mkdirp('./src/assets/uploads/userprofile', function (err) {
        if (err) data["message"] = "Folder is not creating";
      });
    }

  },
  filename: (req, file, cb) => {
    const newFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  },
});

const upload = multer({
  storage
}).array('image', 1);


/* -------- Check User Available or not based mobile and email --------- */
async function checkUserAvail(mobile, email) {
  return new Promise(resolve => {
    let returnVal = false;
    user.find({
      $or: [{
        "mobilenumber": mobile
      }, {
        "email": email
      }]
    }, (err, results) => {
      if (err) return next(err);
      if (results.length > 0) {
        returnVal = true;
      }
      resolve(returnVal);
    });
  });
}

/* -------- User Registration --------- */
app.post('/api/register', (req, res, next) => {
  const formData = req.body;
  checkUserAvail(formData.mobilenumber, formData.email).then(results => {
    if (!results) {
      user.create(formData, function (err, response) {
        if (err) return next(err);
        data['data'] = response;
        data['status'] = "OK";
        data['message'] = "One User is Created";
        res.json(data);
      });
    } else {
      data['message'] = "Already Email and Mobile present. Change Either one";
      data['status'] = "ERR";
      data['data'] = '';
      res.json(data);
    }
  }).catch(err => {
    data['message'] = "Error found in API";
    data['status'] = "ERR";
    data['data'] = '';
    res.json(data);
  });
});

/* -------- Load Data --------- */
app.get('/api/getUsers', (req, res, next) => {
  user.find({}, function (err, users) {
    if (err) return next(err);
    data['data'] = users;
    data['status'] = "OK";
    res.json(data);
  })
});

app.get('/api/getAllTasks', (req, res, next) => {
  assignedTasks.find({}, (err, allTasks) => {
    if (err) return next(err);
    data['data'] = allTasks;
    data['status'] = "OK";
    res.json(data);
  });
});

app.get('/api/getUserTasks/:id', (req, res, next) => {
  const userId = req.params.id;
  assignedTasks.find({ "ref_id": userId }, (err, userTasks) => {
    if (err) return next(err);
    data['data'] = userTasks;
    data['status'] = "OK";
    res.json(data);
  });
});


/* -------- get User Data --------- */
app.get('/api/getUserDetails/:id', (req, res, next) => {
  const userId = req.params.id;
  user.find({
    "_id": userId
  }, function (err, userData) {
    if (err) return next(err);
    userPhotos.find({
      'ref_id': userId,
      'imageactive': true
    }, function (err, result) {
      let profileImg;
      if (result.length > 0) {
        profileImg = result[0].imagepath;
      } else {
        profileImg = '';
      }
      userData[0].profileimage = profileImg;
      data['data'] = userData;
      data['status'] = "OK";
      res.json(data);
    });
  });
});

/* ----------- Upload the User Photo -------------- */
app.post('/api/uploadPhoto', (req, res, next) => {
  upload(req, res, function (err) {
    const userId = req.body.ref_id;
    const uploadedFiles = req.files;
    const filesData = uploadedFiles[0];
    const ImageData = {
      'ref_id': userId,
      'imagetype': filesData.mimetype,
      'imagepath': filesData.path,
      'imagesize': filesData.size,
      'imageactive': true
    };
    userPhotos.update({
      'ref_id': userId
    }, {
        $set: {
          'imageactive': false
        }
      }, {
        w: 1, multi: true
      }, function (err, result) {
        if (err) return next(err);
        userPhotos.create(ImageData, function (err, response) {
          if (err) return next(err);
          data['data'] = uploadedFiles;
          data['status'] = "OK";
          data['message'] = "Profile Image is Updated";
          res.json(data);
        });
      });
  });
});

/* --------- Add new assignment Topic Name ----------------  */
app.post('/api/addNewAssignmentTopic', (req, res, next) => {
  const formData = req.body;
  assignmentTopics.create(formData, function (err, response) {
    if (err) return next(err);
    data['data'] = response;
    data['status'] = "OK";
    data['message'] = "One New Topic is Added!";
    res.json(data);
  });
});

/* --------- get All Topics list ----------------  */
app.get('/api/getAllTopics', (req, res, next) => {
  assignmentTopics.find({}, function (err, topics) {
    if (err) return next(err);
    data['data'] = topics;
    data['status'] = "OK";
    res.json(data);
  });
});

/* ---------------- get Topic Information ---------- */

app.get('/api/getTopicDetails/:id', (req, res, next) => {
  const taskId = req.params.id;
  assignmentTopics.find({ "_id": taskId }, (err, task) => {
    if (err) return next(err);
    data['data'] = task;
    data['status'] = "OK";
    res.json(data);
  });
});

/*---------- submit task to user -------------- */
app.post('/api/submitTask', (req, res, next) => {
  const taskData = req.body;
  assignedTasks.create(taskData, (err, response) => {
    if (err) return next(err);
    data['status'] = "OK";
    data['message'] = "Successfully task added to the user!";
    res.json(data);
  });
});

/*---------- normal login  -------------- */
app.post('/api/login', (req, res, next) => {
  const loginData = req.body;
  const userEmailMobile = loginData.mobile_email;
  const userPassword = loginData.password;
  const userCurrentLoginTime = loginData.last_login;
  user.find({
    $or: [{
      "mobilenumber": userEmailMobile
    }, {
      "email": userEmailMobile
    }]
  },
    function (err, getData) {
      if (err) return next(err);
      if (getData.length > 0) {
        const getPassword = getData[0].password;
        data['status'] = "ERR";
        if (getPassword !== 'NULL' && getPassword !== '') {
          if (getData[0].password === userPassword) {
            const _id = getData[0]._id;
            user.update({ _id: _id }, {
              $set: {
                "last_login": userCurrentLoginTime,
                "userLog": 1
              }
            })
            data['status'] = "OK";
            data['message'] = "MATCHED";
            data['data'] = getData;
          } else {
            data['message'] = "NOTMATCHED";
          }
        } else {
          data['message'] = "PWDEMPTY";
        }
      } else {
        data['message'] = "NOTAVAIL";
      }
      res.json(data);
    });
});

/*----------- Update Password ----------------*/
app.post('/api/updatePassword', (req, res, next) => {
  const formData = req.body;
  const userEmailMobile = formData.mobile_email;
  const userPassword = formData.new_password;
  user.find({
    $or: [{
      "mobilenumber": userEmailMobile
    }, {
      "email": userEmailMobile
    }]
  },
    function (err, userRow) {
      if (userRow.length != 0) {
        const user_id = userRow[0]._id;
        user.update({ _id: user_id }, {
          $set: {
            "password": userPassword,
          }
        }, function (err, result) {
          if (err) return next(err);
          data['message'] = "Successfully password is updated";
          data['status'] = "OK";
          data['data'] = result;
        });

      } else {
        data['message'] = "Mobile or Email is not present.";
        data['status'] = "ERR";
      }
      res.json(data);
    });
});


/*--------------- user login via social ----------------- */
app.post('/api/socialLogin', (req, res, next) => {
  const formData = req.body;
  user.find({
    'email': formData.email,
  }, function (err, result) {
    if (err) return next(err);
    if (result.length != 0) {
      data['status'] = 'OK';
      data['message'] = 'Loggedin Successfully';
      data['data'] = result;
    } else {
      data['status'] = 'ERR';
      data['message'] = "Email doesn't exsit.";
    }
    res.json(data);
  });
});


/*--------- Task Submit Document -------------- */
app.post('/api/uploadTaskDocument', (req, res, next) => {
  upload(req, res, function (err) {
    const userId = req.body.ref_id;
    const taskId = req.body.t_id;
    const uploadedFiles = req.files;
    const filesData = uploadedFiles[0];
    const fileData = {
      'ref_id': userId,
      't_id': taskId,
      'doc_path': filesData.path,
      'doc_size': filesData.size,
      'doc_type': filesData.mimetype,
      'doc_active': true,
      'created_at': new Date(),
      'approved_status': 0
    };
    taskDocuments.create(fileData, function (err, response) {
      if (err) return next(err);
      assignedTasks.update({
        'ref_id': userId,
        't_id': taskId
      }, {
          $set: {
            'completed_status': 1,
            'completed_at': new Date()
          }
        }, {
          w: 1
        }, function (err, result) {
          if (err) return next(err);
          data['data'] = uploadedFiles;
          data['status'] = "OK";
          data['message'] = "Document Successfully Submitted";
          res.json(data);
        });
    });
  });
});


/*--------- Check Task Document -------------- */
app.post('/api/getUserTaskDocumentUpdated/:ref_id/:t_id', (req, res, next) => {
  const userId = req.params.ref_id;
  const taskId = req.params.t_id;
  taskDocuments.find({
    $and: [{
      "ref_id": userId
    }, {
      "t_id": taskId
    }]
  },
    function (err, taskDocumentRow) {
      if (err) return next(err);
      if (taskDocumentRow.length > 0) {
        data['data'] = taskDocumentRow;
        data['status'] = "OK";
        data['message'] = "Document is available";
      }
      else {
        data['data'] = '';
        data['status'] = "ERR";
        data['message'] = "Document is not available";
      }
      res.json(data);
    });
});

/*----------- get user submitted tasks -----------*/
app.get('/api/getUserSubmittedTasks/:id', (req, res, next) => {
  const userId = req.params.id;
  taskDocuments.find({
    $and: [{
      "ref_id": userId
    }, {
      "approved_status": 0
    },
    {
      "doc_active": true
    }]
  },
    function (err, taskDocumentsRow) {
      if (taskDocumentsRow.length > 0) {
        data['data'] = taskDocumentsRow;
        data['status'] = "OK";
        data['message'] = "Submitted Tasks are available";
      }
      else {
        data['data'] = '';
        data['status'] = "ERR";
        data['message'] = "Submitted Task is not available";
      }
      res.json(data);
    });
});

/*---------- update task by admin ----------*/
app.post('/api/updateUserTask', (req, res, next) => {
  const userId = req.body.uId;
  const taskId = req.body.tId;
  const status = req.body.status;
  assignedTasks.update({
    'ref_id': userId,
    't_id': taskId
  }, {
      $set: {
        'approved_status': status,
        'approved_rejected_at': new Date()
      }
    }, {
      w: 1
    }, function (err, result) {
      taskDocuments.update({
        'ref_id': userId,
        't_id': taskId
      }, {
          $set: {
            'approved_status': status,
          }
        }, {
          w: 1
        }, function (err, result) {
          data['data'] = result;
          data['status'] = "OK";
          const updatedStatus = status === 1 ? 'approved' : 'Rejected'
          data['message'] = "This task is " + updatedStatus;
          res.json(data);
        });
    });

});


app.get('/api/test', (req, res, next) => {
  data['data'] = "testdata";
  console.log("test");
  res.send(data);
});


app.listen(port, function () {
  console.log("Node app is running on port " + port);
})
