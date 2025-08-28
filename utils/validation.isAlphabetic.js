const isAlphabetic = (input) => {
  return /^[A-Za-z]+$/.test(input);
};

module.exports = isAlphabetic;
