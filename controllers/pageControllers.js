const Photo = require("../models/photo");

exports.getAboutPage = (req, res) => {
  res.render("about");
};

exports.getEditPhotoPage = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render("edit", {
    photo,
  });
};

exports.getAddPhotoPage = (req, res) => {
  res.render("add");
};
