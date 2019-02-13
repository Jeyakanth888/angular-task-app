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
    /* Files will be saved in the 'uploads' directory. Make
       sure this directory already exists! */
    cb(null, './src/assets/uploads/userprofile');
    mkdirp('./src/assets/uploads/userprofile', function (err) {
      if (err) data["message"] = "Folder is not creating";
    });
  },
  filename: (req, file, cb) => {
    /* uuidv4() will generate a random ID that we'll use for the
      new filename. We use path.extname() to get
      the extension from the original file name and add that to the new
      generated ID. These combined will create the file name used
      to save the file on the server and will be available as
      req.file.pathname in the router handler. */
    const newFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, newFilename);
  },
});
// create the multer instance that will be used to upload/save the file
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
      if (result.length > 0) {
        let profileImg = result[0].imagepath;
      } else {
        profileImg = '' ;
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

app.get('/api/test', (req, res, next) => {
  data['data'] = "testdata";
  console.log("test");
  res.send(data);
});


app.listen(port, function () {
  console.log("Node app is running on port " + port);
})
