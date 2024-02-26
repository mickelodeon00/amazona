export const textWrap = (prop) => {
  const len = prop.length;
  if (len > 15) {
    return prop.slice(0, 15) + '...';
  }
  return prop;
};
