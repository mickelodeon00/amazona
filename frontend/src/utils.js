export const textWrap = (text, len) => {
  const mess = text.length;
  if (mess > len) {
    return text.slice(0, len) + '...';
  }
  return text;
};

export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};
