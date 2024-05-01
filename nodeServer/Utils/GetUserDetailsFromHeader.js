import util from 'util';
import jwt from 'jsonwebtoken';

const verifyToken = async (testToken) => {
    let token;
    if (testToken && testToken.startsWith('Bearer')) {
        token = testToken.split(' ')[1];
    }
    if (!token) {
        throw new CustomError('You are not logged in!', 401);
    }

    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRETKEY);
    return decodedToken;
};

export default verifyToken;
