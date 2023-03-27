export const handleError = (error) => {
  return {
    success: false,
    message: error.message,
    data: null,
    tokens: null,
    stack: error.stack,
  };
};

export const handleSuccess = (
  message = 'success',
  data = {},
  tokens = null,
) => {
  return {
    success: true,
    message,
    data,
    tokens,
    stack: null,
  };
};
