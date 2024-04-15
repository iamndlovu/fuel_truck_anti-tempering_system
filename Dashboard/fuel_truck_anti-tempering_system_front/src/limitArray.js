const limitArray = (arr = [], len = 1) => {
  if (arr.length <= len) return arr;
  let newArr = [];
  while (newArr.length < len) {
    newArr.push(arr.shift());
  }
  return newArr;
};

export default limitArray;
