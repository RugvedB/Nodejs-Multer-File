var express = require("express");
var multer = require("multer");
const { readdirSync, rmSync } = require("fs");
const dirTree = require("directory-tree");
var cors = require("cors");
const fs = require("fs");
const path = require("path");

var app = express();
app.use(cors());

const port = process.env.PORT || 3002;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

/*
app.use('/a',express.static('/b'));
Above line would serve all files/folders inside of the 'b' directory
And make them accessible through http://localhost:3000/a.
*/
app.use(express.static(__dirname + "/public"));

app.use("/uploads", express.static("uploads"));

app.get("/status", function (req, res) {
  res.json({ data: "", message: "Health is up" });
});

app.get("/getfiles", (req, res) => {
  const allFiles = dirTree("./uploads", { attributes: ["size", "mtime"] });
  res.json(allFiles);
});

app.get("/deletefiles", function (req, res) {
  const directory = "./uploads";
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) throw err;
      });
    }
  });
  res.json({ data: "", message: "All file deleted" });
});

app.post(
  "/profile-upload-multiple",
  upload.array("profile-files", 12),
  function (req, res, next) {
    res.json({ data: "", message: "Health is up" });
  }
);

app.post(
  "/profile-upload-single",
  upload.single("profile-file"),
  function (req, res, next) {
    return res.json({ data: "", message: "File uploaded" });
  }
);

app.listen(port, () =>
  console.log(
    `Server running on port ${port}!\nClick http://localhost:${port}/`
  )
);
