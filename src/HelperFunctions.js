const totalVotesHelper = (array) => {
  console.log(array);
  let count = 0;
  array.forEach((ans) => {
    if (ans.value) {
      count += ans.count;
    }
  });
  return count;
};

const percentageCounter = (total, current) => {
  const percantage = (current * 100) / total;
  return isNaN(Math.round(percantage * 10) / 10)
    ? 0
    : Math.round(percantage * 10) / 10;
};

export { totalVotesHelper, percentageCounter };
