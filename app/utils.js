const sortBy = (arr, comparisonGetter) => {
  const sortedArr = [...arr]
  sortedArr.sort((a, b) => {
    var aValue = comparisonGetter(a)
    var bValue = comparisonGetter(b)
    if (aValue < bValue) {
      return -1
    }
    if (aValue > bValue) {
      return 1
    }
    return 0
  })
  return sortedArr
}

module.exports = {
  sortBy
}
