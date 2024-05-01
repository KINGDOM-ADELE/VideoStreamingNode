import Supportcv from "../Models/supportcvModel.js";
import ApiFeatures from "../Utils/ApiFeatures.js";
import asyncErrorHandler from "../Utils/asyncErrorHandler.js";
import CustomError from "../Utils/CustomError.js";
import paginationCrossCheck from "../Utils/paginationCrossCheck.js";
import UnlinkMultipleFiles from "../Utils/UnlinkMultipleFiles.js";
import ProcessMultipleFilesArrayOfObjects from "../Utils/ProcessMultipleFilesArrayOfObjects.js";
import HTMLspecialChars from "../Utils/HTMLspecialChars.js";
import GetUserDetailsFromHeader from "../Utils/GetUserDetailsFromHeader.js";

// Exporting functions
export const getSupportcvs = asyncErrorHandler(async (req, res, next) => {
  let features = new ApiFeatures(Supportcv.find(), req.query)
    .countDocuments()
    .filter()
    .sort()
    .limitfields()
    .limitfields2()
    .paginate();

  // Execute the query and get the result
  let supportcv = await features.query;

  // Get the total count of records
  let totalCount = await features.totalCountPromise;

  console.log("RecordsEstimate", totalCount);

  res.status(200).json({
    status: "success",
    resource: "supportcv",
    RecordsEstimate: totalCount,
    action: "getAll",
    length: supportcv.length,
    data: supportcv,
  });
});

export const getAllSupportcvsOn_ticket_id = asyncErrorHandler(
  async (req, res, next) => {
    const supportcv = await Supportcv.find({
      supportcvTicketId: req.params._id,
    });
    if (!supportcv) {
      const error = new CustomError(
        `Supportcv with supportcvTicketId ID: ${req.params._id} is not found`,
        404,
      );
      return next(error);
    }

    res.status(200).json({
      status: "success",
      resource: "supportcv",
      supportcv: "created",
      length: supportcv.length,
      data: supportcv,
    });
  },
);

export const postSupportcv = asyncErrorHandler(async (req, res, next) => {
  req.body = HTMLspecialChars(req.body);
  if (req.files) {
    let filesArrayOfObjects = ProcessMultipleFilesArrayOfObjects(req);
    req.body.files = filesArrayOfObjects;
  }

  const supportcv = await Supportcv.create(req.body);

  res.status(201).json({
    status: "success",
    resource: "supportcv",
    supportcv: "created",
    length: supportcv.length,
    data: supportcv,
  });
});

export const getSupportcv = asyncErrorHandler(async (req, res, next) => {
  const supportcv = await Supportcv.findById(req.params._id);
  if (!supportcv) {
    const error = new CustomError(
      `Supportcv with ID: ${req.params._id} is not found`,
      404,
    );
    return next(error);
  }

  res.status(200).json({
    status: "success",
    resource: "supportcv",
    supportcv: "created",
    length: supportcv.length,
    data: supportcv,
  });
});

export const patchSupportcv = asyncErrorHandler(async (req, res, next) => {
  req.body = HTMLspecialChars(req.body);
  const supportcv = await Supportcv.findByIdAndUpdate(
    req.params._id,
    req.body,
    { new: true, runValidators: true },
  );
  if (!supportcv) {
    const error = new CustomError(
      `Supportcv with ID: ${req.params._id} is not found`,
      404,
    );
    return next(error);
  }

  res.status(200).json({
    status: "success",
    resource: "supportcv",
    action: "patch",
    length: supportcv.length,
    data: supportcv,
  });
});

export const putSupportcv = asyncErrorHandler(async (req, res, next) => {
  req.body = HTMLspecialChars(req.body);
  const supportcv = await Supportcv.findByIdAndUpdate(
    req.params._id,
    req.body,
    { new: true, runValidators: true },
  );
  if (!supportcv) {
    const error = new CustomError(
      `Supportcv with ID: ${req.params._id} is not available`,
      404,
    );
    return next(error);
  }

  res.status(200).json({
    status: "success",
    resource: "supportcv",
    action: "put",
    length: supportcv.length,
    data: supportcv,
  });
});

export const deleteSupportcv = asyncErrorHandler(async (req, res, next) => {
  const supportcv = await Supportcv.findByIdAndDelete(
    req.params._id,
    req.body,
    { new: true, runValidators: true },
  );
  if (!supportcv) {
    const error = new CustomError(
      `Supportcv with ID: ${req.params._id} is not available`,
      404,
    );
    return next(error);
  }

  if (supportcv.files) {
    UnlinkMultipleFiles(supportcv.files, req);
  }

  res.status(204).json({
    status: "success",
    resource: "supportcv",
    message: "deleted",
  });
});

export const filesToSupportcvsPath = asyncErrorHandler(
  async (req, res, next) => {
    SetUploadsfilePathHandler(req, `./uploads/supportcvs`);
    next();
  },
);

export const checkBrut = asyncErrorHandler(async (req, res, next) => {
  SetUploadsfilePathHandler(req, `./uploads/supportcvs`);
  next();
});

