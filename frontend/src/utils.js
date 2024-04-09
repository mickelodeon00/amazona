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

export const dateFormat = (date, format = 'D') => {
  const newDate = new Date(date.toLocaleString());
  const [minutes, hour, day, month, year] = [
    newDate.getMinutes(),
    newDate.getHours(),
    newDate.getDate(),
    newDate.getMonth(),
    newDate.getFullYear(),
  ];
  const monthValues = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const time =
    hour === 12
      ? ` ${hour}:${minutes < 10 ? `0${minutes}` : minutes} PM`
      : hour > 11
      ? ` ${hour - 12}:${minutes < 10 ? `0${minutes}` : minutes} PM`
      : ` ${hour}:${minutes < 10 ? `0${minutes}` : minutes} AM`;

  if (format.toUpperCase() === 'D') {
    return `${day}-${monthValues[month]}-${year}`;
  } else if (format.toUpperCase() === 'T') {
    return time;
  } else if (format.toUpperCase() === 'DT') {
    return `${day}-${monthValues[month]}-${year},  ${time}`;
  } else {
    return `${day}-${monthValues[month]}-${year}`;
  }
};
