export const internalErrorResponse = (error) => {
  return {
    success: false,
     err: error,
    data: {},
    message: `Internal server Error`,
  };
};

export const customErrorResponse = (error) => {
  if (!error.explanation && !error.message) {
    return internalErrorResponse(error);
  }
  return {
    success: false,
    err: error.explanation,
    data: {},
    message: error.message,
  };
};

export const successResponse = (data, message) => {
  return {
    success: true,
    data,
    message,
    err: {},
  };
};
