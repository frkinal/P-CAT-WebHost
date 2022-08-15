const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const fs = require("fs");
const methodOverride = require("method-override");
const ejs = require("ejs");
const path = require("path");
const Photo = require("./models/photo");

const app = express();

//Connect DB
mongoose.connect("mongodb://localhost/pcat-test-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Template Engine
app.set("view engine", "ejs");

//Middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

//Routes
app.get("/", async (req, res) => {
  const photos = await Photo.find({}).sort("-dataCreated");
  res.render("index", {
    photos,
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/photos/:id", async (req, res) => {
  // console.log(req.params.id);
  //res.render("about");
  const photo = await Photo.findById(req.params.id);
  res.render("photo", { photo });
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/photos", async (req, res) => {
  // console.log(req.files.image);
  // await Photo.create(req.body);
  // res.redirect("/");

  const uploadDir = "public/uploads";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadImage = req.files.image;
  let uploadPath = __dirname + "/public/uploads/" + uploadImage.name;

  uploadImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: "/uploads/" + uploadImage.name,
    });
    res.redirect("/");
  });
});

app.get("/photos/edit/:id", async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render("edit", {
    photo,
  });
});

app.put("/photos/:id", async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/photos/${req.params.id}`);
  res.render("edit", {
    photo,
  });
});

app.delete("/photos/:id", async (req, res) => {
  // console.log(req.params.id);
  const photo = await Photo.findOne({ _id: req.params.id });
  let deleteImage = __dirname + "/public" + photo.image;
  fs.unlinkSync(deleteImage);

  await Photo.findByIdAndRemove(req.params.id);
  res.redirect("/");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda baslatildi...`);
});
