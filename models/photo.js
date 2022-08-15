const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const PhotoSchema = new Schema({
  title: String,
  description: String,
  image: String,
  dataCreated: {
    type: Date,
    default: Date.now,
  },
});

const Photo = mongoose.model("Photo", PhotoSchema);

module.exports = Photo;

//Create a Photo
// Photo.create({
//   title: "Second Photo Title",
//   description: "Second Photo Description",
// });

//Read a Photo
// Photo.find({}, (err, data) => {
//   console.log(data);
// });
