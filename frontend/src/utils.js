export const textWrap = (prop) => {
  const len = prop.length;
  if (len > 15) {
    return prop.slice(0, 15) + '...';
  }
  return prop;
};

export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};
