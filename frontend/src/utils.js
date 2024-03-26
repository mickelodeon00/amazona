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

export const commaSeperated = (...props) => {
  return props.reduce((a, c) => a + ', ' + c);
};

export const roundTo = (n, p) => {
  return (Math.round(n * 10 ** p) * 10 ** -p).toFixed(p);
};
