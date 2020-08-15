const catchErrors = (err, req, res, next)=>{
    console.log(err)
    res.status = err.statusCode || 500;
   
    if(err.name === 'CastError')
        err.message = 'Invalid Parameter';
    else if(err.name === 'MongoError')
        err.message = 'Database Error';

    res.json({
        status: "error",
        statusCode: err.statusCode || 500,
        message: err.message
    });
};

module.exports = catchErrors;