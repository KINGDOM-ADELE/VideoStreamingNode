import User from "../Models/userModel.js";
import CustomError from "../Utils/CustomError.js";
import asyncErrorHandler from "../Utils/asyncErrorHandler.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; // used in registration function
import util from "util"; // used in a function
import sendEmail from "../Utils/email.js";
import limitUserDetailsServeFields from "../Utils/limitUserDetailsServeFields.js";
import paginationCrossCheck from "../Utils/paginationCrossCheck.js";
import crypto from "crypto";
import ApiFeatures from "../Utils/ApiFeatures.js";
import GetUserDetailsFromHeader from "../Utils/GetUserDetailsFromHeader.js";
import SetUploadsfilePathHandler from "../Utils/SetUploadsfilePathHandler.js";
import HTMLspecialChars from "../Utils/HTMLspecialChars.js";
import UnlinkSingleFile from "../Utils/UnlinkSingleFile.js";

let HOST = 'nohost'
if(process.env.NODE_ENV === "development"){
    HOST = process.env.DEV_HOST
}
else if(process.env.TestingForProduction === true && process.env.NODE_ENV === "production"){
    HOST = process.env.DEV_HOST
}
else{
    HOST = process.env.PROD_HOST 
}

let DATE = new Date()
let YY = DATE.getFullYear()


const signToken = (_id, email, role, useragent) => {
  const payload = {
    _id: _id,
    email: email,
    role: role,
    wizard: useragent,
  };
  const exp = { expiresIn: process.env.LOGIN_EXP };
  const secretkey = process.env.SECRETKEY;
  return jwt.sign(payload, secretkey, exp);
};

export const signup = asyncErrorHandler(async (req, res, next) => {
  console.log('req.body', req.body)
  req.body = HTMLspecialChars(req.body);
  let newUser = await User.create(req.body);
  ///
  //2 GENERATE A RANDOM TOKEN FOR THE USER
  const VerificationToken = await newUser.createEmailVerificationToken();

  //4 SEND THE TOKEN TO THE USER VIA EMAIL
  
    const verifyUrl = `${req.protocol}://${HOST}/${process.env.UI_VERIFICATION_PATH}?token=${VerificationToken}`

    const message = `<html><body>
    <p>
    Hi ${newUser.firstName} ${newUser.middleName} ${newUser.lastName},</p> 
    Your account registraion is successful, and 
    we all at ${process.env.ORG_NAME} are happy to welcome you to our world of new possibilities.
    
    <p>
    Please click on 'verify email' below to verify your email.
    </p>
    
    <table align='center' ><tr><td  align='center' style='color:#FFF; cursor:pointer; padding: 10px 18px; border-radius:10px; background-color:#23BE30;'>
    <a href='${verifyUrl}'><b>VERIFY EMAIL</b></a>
    </td></tr></table>

    <p>
    You can also use the link below to verify your email:
    </p>
    
    ${verifyUrl}
    
    <p>
    For information on ${process.env.ORG_NAME} visit <a href='${process.env.ORG_WEBSIT}'>${process.env.ORG_WEBSIT}</a>
    </p>
    
    WITH ${process.env.ORG_NAME.toUpperCase()}, </br>
    YOUR FUTURE AS A TECH ENGINEER IS BRIGHT.
    
    <p>
    Thank you for choosing ${process.env.ORG_NAME}.
    </p>
    
    <p>
    ${req.protocol}://${HOST}
    YY
    </p>
   
    <p>
    ${YY} ${process.env.ORG_NAME}, Ensuring the best of service.
    </p>

    </body></html>`;


    let emailverificationMessage;
    let tries = 0
    let success = 0
    const sendAnEmail = async () => {
        tries += 1
        try{
            await sendEmail({
                email: newUser.email,
                subject: "Registration Successf",
                message: message
            })
            Subject = `Email verification mail has been sent to  ${newUser.email}, pleae veryfy your email address.`
            success += 1
            console.log(emailverificationMessage, `attempts: ${tries}`)
        }
        catch(err){
            newUser.emailVerificationToken = undefined,
            newUser.emailVerificationTokenExp = undefined,
            emailverificationMessage = `Email verification mail failed.`
            console.log(emailverificationMessage, `attempts: ${tries}`)

        }
    }
    while(tries < 5 && success < 1){
      await sendAnEmail () // allows 5 tries to send email before proceeding
    }
    console.log( `proceeding after attempts: ${tries} and success: ${success}`)
    if (success < 1){
        return next(new CustomError(errormessage, 500))
    }
    ///


  // At this point every modification to the user object has been made
  await newUser.save({ validateBeforeSave: false }); // this saves the encrypted token and the expiry date generated in user.createResetPasswordToken(), together with every modification to the user object and {validateBeforeSave: false} prevents validation

  let limitedUser = limitUserDetailsServeFields(newUser);

  // let userAgent = crypto.createHash('sha256').update(req.headers['user-agent']).digest('hex')
  let userAgent = await bcrypt.hash(req.headers["user-agent"], 11);
  const token = signToken(newUser._id, newUser.email, newUser.role, userAgent);

  res.status(201).json({
    status: "success",
    token,
    resource: "user",
    user: "created",
    lenght: newUser.length,
    Subject,
    tries,
    data: limitedUser,
  });
});

export const login = asyncErrorHandler(async (req, res, next) => {
  console.log("loging in");
  req.body = HTMLspecialChars(req.body);
  // const { username, password } = req.body
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    const error = new CustomError(
      "Please provide email and password for login",
      400,
    );
    return next(error);
  }

  // const user = await User.findOne({email: req.body.username, phone: req.body.username})// for phone or email login system
  // const user = await User.findOne({email: email})
  let user = await User.findOne({ email }).select("+password");

  // const isMatch = await user.comparePasswordInDb(password, user.password)
  // handle brut
  if (user.failedLogginAttempts < 5) {
    if (!user || !(await user.comparePasswordInDb(password, user.password))) {
      user.failedLogginAttempts += 1;
      user.lastAttemptTime = new Date();
      await user.save({ validateBeforeSave: false });
      const error = new CustomError(
        `Incorrect login details, ${5 - user.failedLogginAttempts} attempt(s) left`,
        400,
      );
      return next(error);
    } else {
      user.failedLogginAttempts = 0;
      user.lastAttemptTime = new Date();
      await user.save({ validateBeforeSave: false });
    }
  } else if (new Date() - user.lastAttemptTime > 1800000) {
    // 30 min after last failled attempt
    // cancel prev attempt records
    user.failedLogginAttempts = 0;
    user.lastAttemptTime = new Date();
    await user.save({ validateBeforeSave: false });

    //validate new login attempt
    if (!user || !(await user.comparePasswordInDb(password, user.password))) {
      user.failedLogginAttempts = 1;
      user.lastAttemptTime = new Date();
      await user.save({ validateBeforeSave: false });
      const error = new CustomError("Incorrect login details", 400);
      return next(error);
    } else {
      user.failedLogginAttempts = 0;
      user.lastAttemptTime = new Date();
      await user.save({ validateBeforeSave: false });
    }
  } else {
    const error = new CustomError(
      "Incorrect login details or temprarily blocked",
      400,
    );
    return next(error);
  }

  // let userAgent = crypto.createHash('sha256').update(req.headers['user-agent']).digest('hex')
  let userAgent = await bcrypt.hash(req.headers["user-agent"], 11);
  const token = signToken(user._id, user.email, user.role, userAgent);

  let limitedUser = limitUserDetailsServeFields(user);

  res.status(201).json({
    status: "success",
    token,
    resource: "user",
    action: "loggedIn",
    lenght: user.length,
    data: limitedUser,
  });
});

export const protect = asyncErrorHandler(async (req, res, next) => {
  //1 read the token and check if it exist
  const testToken = req.headers.authorization;
  const decodedToken = await GetUserDetailsFromHeader(testToken);

  //3 read the token and check if the user still exist
  const user = await User.findById({ _id: decodedToken._id });
  if (!user) {
    const error = new CustomError(
      "The user with the given token does not exist",
    );
  }
  //4 If the user has changed the password after token was issued
  const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
  if (isPasswordChanged) {
    const error = new CustomError(
      "The password has been changed recently. Please login again",
    );
    next(error);
  }

  const isLoggedOut = await user.isLoggedOut(decodedToken.iat);
  if (isLoggedOut) {
    const error = new CustomError(
      "This account has been logged out from server recently. Please login again",
    );
    next(error);
  }

  // let reqUserAgent = crypto.createHash('sha256').update(req.headers['user-agent']).digest('hex')
  // const sameUserAgent = (decodedToken.useragent === reqUserAgent)
  const sameUserAgent = await bcrypt.compare(
    req.headers["user-agent"],
    decodedToken.wizard,
  );
  if (!sameUserAgent) {
    const error = new CustomError(
      "Expect condition could not be satisfied. Please login again",
      417,
    );
    next(error);
  }

  //allow user to access the route
  req.user = user; // reqxxx
  console.log(" req.user", req.user);
  next();
});

// // for single role
// export const restrict = (role) => {//wrapper function
//     return (req, res, next) => {
//         if(req.user.role !== role){
//             const error = new CustomError('You do not have permision to perform this action', 403)
//             next(error)
//         }
//         next()
//     }
// }

// for multiple roles, we use rest paraameter
export const restrict = (...role) => {
  //wrapper function
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      const error = new CustomError(
        "You do not have permision to perform this action",
        403,
      );
      next(error);
    }
    next();
  };
};

// // for multiple roles, we use rest paraameter
// exports.restrict = (...role) => {//wrapper function
//     return (req, res, next) => {
//         if(!role.includes(req.user.role)){
//             const error = new CustomError('You do not have permision to perform this action', 403)
//             next(error)
//         }
//         next()
//     }
// }

export const forgotpassword = asyncErrorHandler(async (req, res, next) => {
  req.body = HTMLspecialChars(req.body);

  //1 CONFIRM IF A USER WITH THAT EMAIL EXIST IN DB
  // const user = await User.findOne({email: req.body.username, phone: req.body.username})// for phone or email login system
  // const user = await User.findOne({email: req.body.email, phone: req.body.email})// for phone or email

  const user = await User.findOne({ email: req.body.email }); // for phone or email
  if (!user) {
    const error = new CustomError(
      `We could not find a user with the given email (${req.body.email})`,
      404,
    );
    next(error);
  }
  //2 GENERATE A RANDOM TOKEN FOR THE USER
  const resetToken = await user.createResetPasswordToken();

  // this saves the encrypted token and the expiry date generated in user.createResetPasswordToken() and {validateBeforeSave: false} prevents validation
  if (await user.save({ validateBeforeSave: false })) {
    // console.log('user updated successfully')
  } else {
    // console.log('user update failed')
  }
  //4 SEND THE TOKEN TO THE USER VIA EMAIL

  const resetUrl = `${HOST}/${process.env.UI_PASSWORD_RESET_PATH}?resetToken=${resetToken}`

  // const message = `We have recieved a password reset request. Please use the link below to reset your password\n\n ${resetUrl} \n\n
  // this link will be valid for 10 munutes.`

  const message = `<html><body>
    <p>
    Hi ${newUser.firstName} ${newUser.middleName} ${newUser.lastName},</p> 
    Your account registraion is successful, and 
    we all at ${process.env.ORG_NAME} are happy to welcome you to our world of new possibilities.
    
    <p>
    If you need to change your password, your RESET code is:
    </p>
    
    <table align='center' ><tr><td  align='center' style='	color:#FFF; cursor:pointer; padding: 10px 18px; border-radius:10px; background-color:#23BE30;'>
    <b>${resetToken}</b>
    </td></tr></table>
    
    <p>
     This code expires after 10 munites from the request time.
    
    You can also click on 'reset password' below to change your password.
    </p>
    
    <table align='center' ><tr><td  align='center' style='	color:#FFF; cursor:pointer; padding: 10px 18px; border-radius:10px; background-color:#23BE30;'>
    <a href='/${resetUrl}'><b>RESET PASSWORD</b></a>
    </td></tr></table>
    
    <p>
    For information on ${process.env.ORG_NAME} visit <a href='${process.env.ORG_WEBSIT}'>${process.env.ORG_WEBSIT}</a>
    </p>
    
    WITH ${process.env.ORG_NAME.toUpperCase()}, </br>
    YOUR FUTURE AS A TECH ENGINEER IS BRIGHT.
    
    <p>
    Thank you for choosing ${process.env.ORG_NAME}.
    </p>
    
    <p>
    ${req.protocol}://${HOST}
    YY
    </p>
    
    <p>
    ${YY} ${process.env.ORG_NAME}, Ensuring the best of service.
    </p>

    </body></html>`;

    
    let tries = 0
    let success = 0
    let errormessage = ''
    let Subject= ''
    const sendAnEmail = async () => {
      tries += 1
      try {
        await sendEmail({
          email: user.email,
          subject: "Password reset request",
          message: message,
          
        });
        Subject = "Password change request recievced";
        success += 1
      } catch (err) {
        // destroy the saved token and then throw error
        user.passwordResetToken = undefined;
        user.passwordResetTokenExp = undefined;
        errormessage = `There is an error sending password reset email. Please try again later`
      }
    }

    while(tries < 5 && success < 1){
        await sendAnEmail () // allows 5 tries to send email before proceeding
    }
    console.log( `proceeding after attempts: ${tries} and success: ${success}`)
    if (success < 1){
      return next(new CustomError(errormessage, 500))
    }

    res.status(200).json({
      status: "success",
      Subject,
      message: message,
    });

    


});

export const resetpassword = asyncErrorHandler(async (req, res, next) => {
  req.body = HTMLspecialChars(req.body);
  if (req.body.confirmPassword !== req.body.password) {
    const error = new CustomError(
      "Password and confirmPassword does not match!",
      400,
    );
    return next(error);
  }
  const cryptotoken = crypto
    .createHash("sha256")
    .update(req.params.Token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: cryptotoken,
    passwordResetTokenExp: { $gt: Date.now() },
  });

  if (!user) {
    const userx = await User.findOne({ passwordResetToken: cryptotoken });
    if (userx) {
      // there is a pasward reset token, delete it
      userx.password = req.body.password;
      userx.passwordResetToken = undefined;
      userx.passwordResetTokenExp = undefined;
    }

    const error = new CustomError("Token is invalid or has expired", 404);
    next(error);
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordChangedAt = Date.now();
  user.passwordResetToken = undefined;
  user.passwordResetTokenExp = undefined;

  user.save(); // we want to allow validation

  const token = signToken(user._id, user.email, user.role);

  ///
  //4 SEND THE TOKEN TO THE USER VIA EMAIL

  const message = `<html><body>
    <p>
    Hi ${user.firstName} ${user.middleName} ${user.lastName},</p> 
    
    Your password has been reset succesffully.
    <p>
    Please notify us at support@mrsoft.com if you did not perform this password reset:
    </p>
    
    
    <p>
    For information on ${process.env.ORG_NAME} visit <a href='${process.env.ORG_WEBSIT}'>${process.env.ORG_WEBSIT}</a>
    </p>
    
    WITH ${process.env.ORG_NAME.toUpperCase()}, </br>
    YOUR FUTURE AS A TECH ENGINEER IS BRIGHT.
    
    <p>
    Thank you for choosing ${process.env.ORG_NAME}.
    </p>
    
    <p>
    ${req.protocol}://${HOST}
    YY
    </p>
   
    <p>
    ${YY} ${process.env.ORG_NAME}, Ensuring the best of service.
    </p>

    </body></html>`;

  let emailverificationMessage;
  let tries = 0
  let success = 0
  let errormessage = ''
  const sendAnEmail = async () => {
    tries += 1
    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset request",
        message: message,
      });
      Subject = `Password reset mail successfull.`;
      success += 1
    } catch (err) {
      errormessage = `There is an error sending password reset email. Please try again later`
      emailverificationMessage = `Password reset mail failed.`;
    }

  }
  while(tries < 5 && success < 1){
    await sendAnEmail () // allows 5 tries to send email before proceeding
  }
  console.log( `proceeding after attempts: ${tries} and success: ${success}`)
  if (success < 1){
      // return next(new CustomError(errormessage, 500))
  }
  ///



  res.status(201).json({
    status: "success",
    token,
    Subject,
    resource: "user",
    action: "password-reset",
  });
});

export const changePassword = asyncErrorHandler(async (req, res, next) => {
  req.body = HTMLspecialChars(req.body);

  const password = req.body.oldpassword;
  if (req.body.confirmPassword !== req.body.password) {
    const error = new CustomError(
      "Password and confirmPassword does not match!",
      400,
    );
    return next(error);
  }

  if (req.body.email) {
    const error = new CustomError(
      `Unauthorized action detected, you can not change email through this link`,
      404,
    );
  }
  const testToken = req.headers.authorization;
  const decodedToken = await GetUserDetailsFromHeader(testToken);

  const user = await User.findById(decodedToken._id).select("+password");

  let repass = await user.comparePasswordInDb(password, user.password);

  // handle brut
  if (user.failedLogginAttempts < 5) {
    if (!user || !(await user.comparePasswordInDb(password, user.password))) {
      user.failedLogginAttempts += 1;
      user.lastAttemptTime = new Date();
      await user.save({ validateBeforeSave: false });
      const error = new CustomError(
        `Incorrect login details, ${5 - user.failedLogginAttempts} attempt(s) left`,
        400,
      );
      return next(error);
    } else {
      user.failedLogginAttempts = 0;
      user.lastAttemptTime = new Date();
      await user.save({ validateBeforeSave: false });
    }
  } else if (new Date() - user.lastAttemptTime > 1800000) {
    // 30 min after last failled attempt
    // cancel prev attempt records
    user.failedLogginAttempts = 0;
    user.lastAttemptTime = new Date();
    await user.save({ validateBeforeSave: false });

    //validate new login attempt
    if (!user || !(await user.comparePasswordInDb(password, user.password))) {
      user.failedLogginAttempts = 1;
      user.lastAttemptTime = new Date();
      await user.save({ validateBeforeSave: false });
      const error = new CustomError("Incorrect login details", 400);
      return next(error);
    } else {
      user.failedLogginAttempts = 0;
      user.lastAttemptTime = new Date();
      await user.save({ validateBeforeSave: false });
    }
  } else {
    const error = new CustomError(
      "Incorrect login details or temprarily blocked",
      400,
    );
    return next(error);
  }

  if (user) {
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.password = req.body.password;
    user.passwordChangedAt = Date.now();
    user.passwordResetToken = undefined;
    user.passwordResetTokenExp = undefined;
    user.save(); // we want to allow validation
  }

  res.status(200).json({
    status: "success",
    resource: "user",
    action: "password change",
  });
});

export const getUsers = asyncErrorHandler(async (req, res, next) => {
  let features = new ApiFeatures(User.find(), req.query)
    .countDocuments()
    .filter()
    .sort()
    .limitfields()
    .paginate();

  // Execute the query and get the result
  let supportcv = await features.query;

  // Get the total count of records
  let totalCount = await features.totalCountPromise;

  req.query.page && paginationCrossCheck(user.length);

  limitedUser = limitUserDetailsServeFields(user);

  res.status(200).json({
    status: "success",
    resource: "users",
    RecordsEstimate: totalCount,
    lenght: user.length,
    data: user,
  });
});

export const searchUsers = asyncErrorHandler(async (req, res, next) => {
  let features = new ApiFeatures(
    User.find({
      $or: [
        { email: { $regex: "^" + req.query.search } },
        { firstName: { $regex: "^" + req.query.search } },
        { middleName: { $regex: "^" + req.query.search } },
        { lastName: { $regex: "^" + req.query.search } },
      ],
    }),
    req.query,
  )
    .limitfields()
    .paginate();

  let user = await features.query;

  req.query.page && paginationCrossCheck(user.length);

  limitedUser = limitUserDetailsServeFields(user);

  res.status(200).json({
    status: "success",
    resource: "users",
    lenght: user.length,
    data: user,
  });
});

export const getAuser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params._id);
  if (!user) {
    const error = new CustomError(
      `User with ID: ${req.params._id} is not found`,
      404,
    );
    //return to prevent further execution of the rest of the codes
    return next(error);
  }
  limitedUser = limitUserDetailsServeFields(user);
  res.status(200).json({
    status: "success",
    resource: "user",
    lenght: user.length,
    data: limitedUser,
  });
});

export const getMyProfile = asyncErrorHandler(async (req, res, next) => {
  const testToken = req.headers.authorization;
  const decodedToken = await GetUserDetailsFromHeader(testToken);

  const user = await User.findById(decodedToken._id);
  if (!user) {
    const error = new CustomError(
      `User with ID: ${decodedToken._id} is not found`,
      404,
    );
    //return to prevent further execution of the rest of the codes
    return next(error);
  }
  limitedUser = limitUserDetailsServeFields(user);

  res.status(200).json({
    status: "success",
    resource: "user",
    lenght: user.length,
    data: limitedUser,
  });
});

export const updateUser = asyncErrorHandler(async (req, res, next) => {
  const testToken = req.headers.authorization;
  const decodedToken = await GetUserDetailsFromHeader(testToken);
  req.body = HTMLspecialChars(req.body);
  if (req.body.password || req.body.email) {
    const error = new CustomError(
      `Unauthorized action detected, you can not change email or password through this link`,
      404,
    );
  }
  // const user = await user.find({_id: req.param._id})
  const user = await User.findByIdAndUpdate(decodedToken._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    const error = new CustomError(
      `User with ID: ${decodedToken._id} is not found`,
      404,
    );
    return next(error);
  }
  limitedUser = limitUserDetailsServeFields(user);

  res.status(200).json({
    status: "success",
    resource: "user",
    action: "patch",
    lenght: user.length,
    data: limitedUser,
  });
});



export const logOutAll = asyncErrorHandler(async (req, res, next) => {
  const testToken = req.headers.authorization;
  const decodedToken = await GetUserDetailsFromHeader(testToken);

  const user = await User.findById(decodedToken._id);

  if (!user) {
    const error = new CustomError(
      `User with ID: ${decodedToken._id} is not available`,
      404,
    );
    return next(error);
  }

  if (user) {
    user.loggedOutAllAt = Date.now();
    let loggedout = await user.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    status: "success",
    resource: "user",
    action: "logout all",
  });
});

export const adminUpdateUser = asyncErrorHandler(async (req, res, next) => {
  req.body = HTMLspecialChars(req.body);
  if (req.body.password || req.body.email) {
    const error = new CustomError(
      `Unauthorized action detected, you can not change email or password through this link`,
      404,
    );
  }
  // const user = await user.find({_id: req.param._id})
  const user = await User.findByIdAndUpdate(req.params._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    const error = new CustomError(
      `User with ID: ${req.params._id} is not found`,
      404,
    );
    return next(error);
  }
  limitedUser = limitUserDetailsServeFields(user);

  res.status(200).json({
    status: "success",
    resource: "user",
    action: "update",
    lenght: user.length,
    data: limitedUser,
  });
});

export const deleteUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    const error = new CustomError(
      `User with ID: ${req.params._id} is not available`,
      404,
    );
    return next(error);
  }

  //// unlink single files
  if (user.profileImg) {
    UnlinkSingleFile(user.profileImg, req);
  }
  res.status(204).json({
    status: "success",
    resource: "user",
    message: "deleted",
  });
});

export const verifyEmail = asyncErrorHandler(async (req, res, next) => {
  req.body = HTMLspecialChars(req.body);
  const cryptotoken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({ emailVerificationToken: cryptotoken });

  if (!user) {
    const error = new CustomError("Verification token is invalid", 404);
    next(error);
  }

  user.emailVerificationTokenExp = undefined;

  user.save(); // we want to allow validation

  limitedUser = limitUserDetailsServeFields(user);

  const token = signToken(user._id, user.email, user.role);

  res.status(201).json({
    status: "success",
    token,
    resource: "user",
    action: "password-reset and auto login",
    lenght: user.length,
    data: limitedUser,
  });
});

export const approveUser = asyncErrorHandler(async (req, res, next) => {
  req.body = HTMLspecialChars(req.body);
  const user = await User.findById(req.params._id);

  if (!user) {
    const error = new CustomError(
      `User with ID: ${req.params._id} is not found`,
      404,
    );
    next(error);
  }

  if (req.query.action === "approveTrue") {
    user.approved = true;
  } else if (req.query.action === "approveFalse") {
    user.approved = false;
  } else {
    user.approved = true;
  }
  await user.save({ validateBeforeSave: false });

  // UPDATE EQUIRY STARTS
  // using or together with and
  let enquiry = await Enquiry.find({
    $or: [
      { $and: [{ Email: user.email }, { prospect: true }] },
      { $and: [{ phone: user.phone }, { prospect: true }] },
      { $and: [{ Email: user.email }, { prospect: "true" }] },
      { $and: [{ phone: user.phone }, { prospect: "true" }] },
    ],
  });

  if (enquiry.length > 0) {
    const enquiry2 = await Enquiry.findByIdAndUpdate(
      enquiry[0]._id,
      { prospect: false },
      { new: true, runValidators: true },
    );
  }
  // UPDATE EQUIRY ENDS

  // UPDATE OR CREATE STATS STARTS

  if (req.query.action === "approveTrue") {
    await StatusStatsHandler(
      "approveTrue",
      "approveTrue",
      "approveTrue",
      false,
    );
  } else if (req.query.action === "approveFalse") {
    await StatusStatsHandler(
      "approveFalse",
      "approveFalse",
      "approveFalse",
      false,
    );
  } else {
    await StatusStatsHandler(
      "approveTrue",
      "approveTrue",
      "approveTrue",
      false,
    );
  }

  // UPDATE OR CREATE STATS ENDS
  //4 SEND THE NOTICE TO THE USER VIA EMAIL

  const message = `<html><body>
    <p>
    Hi ${user.firstName} ${user.middleName} ${user.lastName},</p> 
    
    This is to notify you that your account with ${process.env.ORG_NAME} has been approved.

    <p>
    For information on ${process.env.ORG_NAME} visit <a href='${process.env.ORG_WEBSIT}'>${process.env.ORG_WEBSIT}</a>
    </p>
    
    WITH ${process.env.ORG_NAME.toUpperCase()}, </br>
    YOUR FUTURE AS A TECH ENGINEER IS BRIGHT.
    
    <p>
    Thank you for choosing ${process.env.ORG_NAME}.
    </p>
    
    <p>
    ${req.protocol}://${HOST}
    YY
    </p>
   
    <p>
    ${YY} ${process.env.ORG_NAME}, Ensuring the best of service.
    </p>

    </body></html>`;

  let userApprovalMessage;
  let tries = 0
  let success = 0
  let errormessage = ''
  const sendAnEmail = async () => {
    tries += 1
    try {
      await sendEmail({
        email: user.email,
        subject: "Usere account approval",
        message: message,
      });
      userApprovalMessage = `User account approval mail successfull.`;
      success += 1
    } catch (err) {
      errormessage = `There is an error sending Usere account approval mail. Please try again later`
      userApprovalMessage = `User account approval mail failed.`;
    }
  }
  while(tries < 5 && success < 1){
    await sendAnEmail () // allows 5 tries to send email before proceeding
  }
  console.log( `proceeding after attempts: ${tries} and success: ${success}`)
  if (success < 1){
      // return next(new CustomError(errormessage, 500))
  }
  ///


  limitedUser = limitUserDetailsServeFields(user);

  res.status(201).json({
    status: "success",
    userApprovalMessage,
    resource: "user",
    action: "account approved",
    data: limitedUser,
  });
});



export const fileToProfileImgPath = asyncErrorHandler(
  async (req, res, next) => {
    SetUploadsfilePathHandler(req, `./uploads/profileImgs`);
    next();
  },
);

export const filesToFeedsPath = asyncErrorHandler(async (req, res, next) => {
  let tpath = SetUploadsfilePathHandler(req, `./uploads/feeds`);
  next();
});

export const filesToSupportsPath = asyncErrorHandler(async (req, res, next) => {
  SetUploadsfilePathHandler(req, `./uploads/supports`);
  next();
});

export const filesTosupportcvsPath = asyncErrorHandler(
  async (req, res, next) => {
    SetUploadsfilePathHandler(req, `./uploads/supportscv`);
    next();
  },
);

export const filesToVideosPath = asyncErrorHandler(
  async (req, res, next) => {
    SetUploadsfilePathHandler(req, `./uploads/videos`);
    next();
  },
);

export const checkBrut = asyncErrorHandler(async (req, res, next) => {
  SetUploadsfilePathHandler(req, `./uploads/supports`);
  next();
});
