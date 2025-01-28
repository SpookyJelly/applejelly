const regex = /[ /_.:;]/;

export const getFuzzyScore = (str1, str2, threshold) => {
  if (str1 === str2) return 1;
  if (str1.includes(str2)) return 0.99 - (str1.length - str2.length) / str1.length * 0.05;
  if (str2 === '') return 0;

  let score, index, partialScore
  let totalScore = 0
  const str1Lower = str1.toLowerCase()
  const str2Lower = str2.toLowerCase()
  let lastIndex = 0
  let normalization = 1;

  const calculateScore = (currentIndex, char1, char2) => {
    partialScore = currentIndex === lastIndex ? 0.7 : 0.1;
    if (regex.test(char1)) partialScore += 0.8;
    if (char1 === char2) partialScore += 0.1;
    return partialScore;
  };

  if (threshold) {
    const adjustment = 1 - threshold;
    str2Lower.split('').forEach(char => {
      index = str1Lower.indexOf(char, lastIndex);
      if (index !== -1) {
        totalScore += calculateScore(index, str1[index], char);
        lastIndex = index + 1;
      } else {
        normalization += adjustment;
      }
    });
  } else {
    str2Lower.split('').filter(char => !regex.test(char)).forEach(char => {
      index = str1Lower.indexOf(char, lastIndex);
      if (index === -1) return 0;
      totalScore += calculateScore(index, str1[index], char);
      lastIndex = index + 1;
    });
  }

  score = 0.5 * (totalScore / str1.length + totalScore / str2.length) / normalization;
  if (str2Lower[0] === str1Lower[0] && score < 0.85) score += 0.15;

  return score;
};
