import {Album} from "../models/albumModel.js";

const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find()
    return res.status(200).json(albums)
  } catch (error){
    console.error("Error in getAllAlbums",error);
    next(error)
  }
}

const getAlbumById = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id).populate("songs");

    if (!album) {
      return res.status(404).json({message: "Album not found"});
    }

    return res.status(200).json(album)
  } catch (error){
    console.error("Error in getAlbumById",error);
    next(error)
  }
}

export {getAllAlbums, getAlbumById};