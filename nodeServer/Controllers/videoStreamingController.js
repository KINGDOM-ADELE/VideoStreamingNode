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
    let features = new ApiFeatures(Video.find(), req.query)
    .countDocuments()
    .filter()
    .sort()
    .limitfields()
    .limitfields2()
    .paginate();

    // Execute the query and get the result
    let video = await features.query;
    req.query.page && paginationCrossCheck(video.length);

    // Get the total count of records
    let totalCount = await features.totalCountPromise;

    console.log("RecordsEstimate", totalCount);

    res.status(200).json({
    status: "success",
    resource: "videos",
    RecordsEstimate: totalCount,
    action: "getAll",
    length: video.length,
    data: video,
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
    console.log('req.body',req.body)
    const decodedToken = await GetUserDetailsFromHeader(testToken);
    console.log('decodedToken._id', decodedToken._id)
    // req.body.createdBy = JSON.parse(decodedToken._id);
    req.body.createdBy = decodedToken._id;
    req.body = HTMLspecialChars(req.body);

    if(req.files){
        let filesArrayOfObjects = await ProcessMultipleFilesArrayOfObjects(req);
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


export const seeVideo = asyncErrorHandler(async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.videoId);
        if (!video) {
            const error = new CustomError(`Video with ID: ${req.params.videoId} not found`, 404);
            return next(error);
        }

        // Set the output directory path for resized videos
        const outputDir = path.join(__dirname, 'resized_videos');

        // Ensure the output directory exists, if not create it
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // Define resolutions for conversion
        const resolutions = [
            { name: '240p', width: 426, height: 240 },
            { name: '360p', width: 640, height: 360 },
            { name: '480p', width: 854, height: 480 },
            { name: '720p', width: 1280, height: 720 },
            { name: '1080p', width: 1920, height: 1080 },
            { name: '1440p', width: 2560, height: 1440 },
            { name: '2160p', width: 3840, height: 2160 }
        ];

        // Convert the video to different resolutions
        const conversions = resolutions.map(async (resolution) => {
            const outputFileName = `${video._id}_${resolution.name}.mp4`;
            const outputPath = path.join(outputDir, outputFileName);
            await resizeVideo(video.filePath, outputPath, resolution.width, resolution.height);
            return { resolution: resolution.name, path: outputPath };
        });

        const convertedVideos = await Promise.all(conversions);
        res.json({ message: 'Video converted successfully', convertedVideos });
    } catch (error) {
        console.error('Error converting video:', error);
        next(new CustomError('Internal server error', 500));
    }
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

export const searchVideo = asyncErrorHandler(async (req, res, next) => {

    let features = new ApiFeatures(Video.find( 
        {$or: [ 
        { Email: { $regex: "^"+req.query.search }},
        { fullName: { $regex: "^"+req.query.search }},
        { enquirerEmail: { $regex: "^"+req.query.search }}, 
        { enquirerPhone: { $regex: "^"+req.query.search }},
        { Email: { $regex: "^"+req.query.search }}, 
        { beneficiaryName: { $regex: "^"+req.query.search }},
        { Email: { $regex: "^"+req.query.search }}, 
        { phone: { $regex: "^"+req.query.search }}
        ]}
        ), req.query).limitfields().paginate()
     
 
    let enquiry = await features.query


    req.query.page && paginationCrossCheck(enquiry.length)
    
    
    res.status(200).json({ 
        status : "success",
        action : "search",
        resource : "enquiries",
        lenght : enquiry.length,
        data : enquiry
    })  
})
