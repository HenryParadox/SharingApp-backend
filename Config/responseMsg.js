const successResponse = (data, msg) => {
    return (responseData = {
      success: true,
      statusCode: 200,
      message: msg,
      data: data,
    });
  };
  
  const errorResponse = (errMessage) => {
    return (responseData = {
      success: false,
      statusCode: 400,
      message: errMessage,
      data: null,
    });
  };
  
  module.exports = {
    successResponse,
    errorResponse,
  };
  