export const handleError = (error) => {
  return {
    success: false,
    message: error.message,
    stack: error.stack,
  };
};

export const handleSuccess = (data, tokens = null) => {
  return {
    success: true,
    data,
    tokens,
  };
};
