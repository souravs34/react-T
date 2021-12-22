const fs = require("fs");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Place = require("../models/place");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken =
  "pk.eyJ1Ijoic291cmF2YiIsImEiOiJja3d5b2t2ZzgwcGgyMm5tbjAxc3pkeHByIn0.SgF9RjWoozF0NA3RVFibsQ";
const geocoder = mbxGeocoding({ accessToken: mapboxToken });
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; //{pid:'p1}
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong,could not find a place ",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id",
      404
    );
    return next(error);
  }
  console.log("Get Request in Places");
  res.json({ place: place.toObject({ getters: true }) });
  // To convert to javascript object and add id property
};

//function getPlaceById(){...}
//const getPlaceByid = function(){...}
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later",
      500
    );
    return next(error);
  }

  if (!places) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }

  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
  // Because find return array and toObject can't be used to array, So we use map
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address, creator } = req.body;
  let coordinates = { lat: 17.6745342, lng: 73.9832418 };
  const geoData = await geocoder
    .forwardGeocode({
      query: address,
      limit: 1,
    })
    .send();
  // console.log(geoData.body.features[0].geometry.coordinates);
  const geoDataArray = geoData.body.features[0].geometry.coordinates;
  if (geoDataArray[0] !== null || geoDataArray[1] !== null) {
    coordinates = { lat: geoDataArray[0], lng: geoDataArray[1] };
  }

  // const coordinates = {
  //   lat: 117.6902408,
  //   lng: 174.0115749,
  // };

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path, // => File Upload module, will be replaced with real image url
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id.", 404);
    return next(error);
  }

  // console.log(user);

  try {
    // await createdPlace.save();
    const sess = await mongoose.startSession(); // Note in Udemy
    await sess.startTransaction(); // If anything goes wrong in sess then nothing is saved in DB
    await createdPlace.save({ session: sess });

    user.places.push(createdPlace); // Added places Id to user
    await user.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "aCreating place failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
  //DUMMY_PLACES.push(createdPlace); //unshift(createdPlace)
};
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place",
      500
    );
    return next(error);
  }

  // const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  // const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  // updatedPlace.title = title;
  // updatedPlace.description = description;
  // DUMMY_PLACES[placeIndex] = updatedPlace;

  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to edit this place.", 401);
    return next(error);
  }
  place.title = title;
  place.description = description;
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place",
      500
    );
    return next(error);
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
  // Convert normal object to javascript object
};
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate("creator"); // Gets all information of creator from user document
  } catch (err) {
    const error = new HttpError(
      "Something Went wrong, Could not delete place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id", 404);
    return next(error);
  }

  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this place.",
      401
    );
    return next(error);
  }

  const imagePath = place.image;
  try {
    // await place.remove();
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something Went wrong, Could not delete place",
      500
    );
    return next(error);
  }
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
  // if (!DUMMY_PLACES.indexOf((p) => p.id != placeId)) {
  //   throw new HttpError("Could not find place for that id", 404);
  // }
  // DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Deleted Place" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
