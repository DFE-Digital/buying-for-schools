
const getQuestionAnswerPairSlugs = (url) => {
  const trimmedSlashes = url.replace(/^\/+|\/+$/g, '')
  if (trimmedSlashes === '') {
    return {}
  } 
  const urlPaths = trimmedSlashes.split('/')
  const keys = urlPaths.filter((p, i) => i % 2 === 0)
  const vals = urlPaths.filter((p, i) => i % 2 === 1)
  const pairs = {}
  keys.forEach((k, i) => {
    pairs[k] = (i < vals.length) ? vals[i] : undefined
  })
  return pairs
}

module.exports = {
  getQuestionAnswerPairSlugs
}
