export const replace = (list, searchVal, ...replaceVal) => {
  const index = list.indexOf(searchVal);
  if (index >= 0) {
    return list.splice(index, 1, ...replaceVal);
  }
  return list;
};

export const remove = (list, values) => {
  const arrValues = Array.isArray(values) ? values : [values];
  return list.filter(val => {
    return (arrValues.indexOf(val) === -1);
  });
};