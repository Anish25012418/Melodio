import {Song} from "../models/songModel.js";

const getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  }catch(error) {
    console.error("Error at getAllSongs", error);
    next(error)
  }
}

const getFeaturedSongs = async (req, res, next) => {
  try {
    //fetch 6 random songs using mongo db aggregation pipeline
    const songs = await Song.aggregate([
      {
        $sample:{size: 6}
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        }
      }
    ])
    res.json(songs);
  }catch(error) {
    console.error("Error in getFeaturedSongs",error);
    next(error)
  }
}

const getMadeForYouSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample:{size: 4}
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        }
      }
    ])
    res.json(songs);
  }catch(error) {
    console.error("Error in getMadeForYouSongs",error);
    next(error)
  }
}

const getTrendingSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      {
        $sample:{size: 4}
      },
      {
        $project: {
          _id: 1,
          title: 1,
          artist: 1,
          imageUrl: 1,
          audioUrl: 1,
        }
      }
    ])
    res.json(songs);
  }catch(error) {
    console.error("Error in getTrendingSongs",error);
    next(error)
  }
}

export {getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs}