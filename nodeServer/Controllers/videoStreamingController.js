import Video from '../Models/VideoModel.js';
// import User from '../Models/UserModel.js';
import ApiFeatures from '../Utils/ApiFeatures.js';
import asyncErrorHandler from '../Utils/asyncErrorHandler.js';
import CustomError from '../Utils/CustomError.js';
import paginationCrossCheck from '../Utils/paginationCrossCheck.js';
import UnlinkMultipleFiles from '../Utils/UnlinkMultipleFiles.js';
import ProcessMultipleFilesArrayOfObjects from '../Utils/ProcessMultipleFilesArrayOfObjects.js';
import HTMLspecialChars from '../Utils/HTMLspecialChars.js';
import GetUserDetailsFromHeader from '../Utils/GetUserDetailsFromHeader.js';
import limitUserDetailsServeFields from '../Utils/limitUserDetailsServeFields.js';

export const getVideos = asyncErrorHandler(async (req, res, next) => {
    let features = new ApiFeatures(Video.find(), req.query).filter().sort().limitfields().limitfields2().paginate();
    let video = await features.query;
    req.query.page && paginationCrossCheck(video.length);
    res.status(200).json({ 
        status: "success",
        resource: "feed",
        length: video.length,
        data: video
    });
});

export const getVideoAd = asyncErrorHandler(async (req, res, next) => {
    let features = new ApiFeatures(Video.find(), req.query).filter().sort().limitfields().limitfields2().paginate();
    let video = await features.query;
    req.query.page && paginationCrossCheck(video.length);
    res.status(200).json({ 
        status: "success",
        resource: "video",
        length: video.length,
        data: video
    });
});

export const postVideo = asyncErrorHandler(async (req, res, next) => {
    const testToken = req.headers.authorization;
    const decodedToken = await GetUserDetailsFromHeader(testToken);
    req.body.createdBy = decodedToken._id;
    req.body = HTMLspecialChars(req.body);

    if(req.files){
        let filesArrayOfObjects = ProcessMultipleFilesArrayOfObjects(req);
        req.body.files = filesArrayOfObjects;
    }
    
    const video = await Video.create(req.body);
    res.status(201).json({ 
        status: "success",
        resource: "video",
        length: video.length,
        data: video
    });
});

export const getVideo = asyncErrorHandler(async (req, res, next) => {
    const video = await Video.findById(req.params._id);
    if(!video){
        const error = new CustomError(`video with ID: ${req.params._id} is not found`, 404);
        return next(error);
    }

    const user = await User.findById(video.createdBy);
    if (!user) {
        const error = new CustomError(`User with ID: ${video.createdBy} is not found`, 404);
        return next(error);
    }
    const limitedUser = limitUserDetailsServeFields(user);
    video.createdBy = limitedUser;

    res.status(200).json({ 
        status: "success",
        resource: "video",
        length: video.length,
        data: video
    });
});

export const patchVideo = asyncErrorHandler(async (req, res, next) => {
    req.body = HTMLspecialChars(req.body);

    const video = await Video.findByIdAndUpdate(req.params._id, req.body, {new: true, runValidators: true});
    if(!video){
        const error = new CustomError(`video with ID: ${req.params._id} is not found`, 404);
        return next(error);
    }

    res.status(200).json({ 
        status: "success",
        resource: "video",
        action: "patch",
        length: video.length,
        data: video
    });
});

export const putVideo = asyncErrorHandler(async (req, res, next) => {
    req.body = HTMLspecialChars(req.body);
    const video = await Video.findByIdAndUpdate(req.params._id, req.body, {new: true, runValidators: true});
    if(!video){
        const error = new CustomError(`video with ID: ${req.params._id} is not available`, 404);
        return next(error);
    }

    res.status(200).json({ 
        status: "success",
        resource: "video",
        action: "put",
        length: video.length,
        data: video
    });
});

export const deleteVideo = asyncErrorHandler(async (req, res, next) => {
    const video = await Video.findByIdAndDelete(req.params._id, req.body, {new: true, runValidators: true});
    if(!video){
        const error = new CustomError(`video with ID: ${req.params._id} is not available`, 404);
        return next(error);
    }

    if(video.files){
        UnlinkMultipleFiles(video.files, req);
    }

    res.status(200).json({  
        status: "success",
        resource: "video",
        message: 'deleted'
    });
});
