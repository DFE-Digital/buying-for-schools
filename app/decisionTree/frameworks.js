const makeFrameworks = data => {
  const frameworks = data.map(frameworkdata => makeFramework(frameworkdata))
  return {
    get: (ref) => frameworks.find(f => f.getRef() === ref),
    getAll: () => [...frameworks]
  }
}

const makeFramework = frameworkdata => {
  const { ref, title, supplier, url, cat } = frameworkdata
  return {
    getRef: () => ref,
    getTitle: () => title,
    getSupplier: () => supplier,
    getUrl: () => url,
    getCategory: () => cat,
    toObject: () => {
      return {
        ref,
        title,
        supplier,
        url,
        cat
      }
    }
  }
}

module.exports = {
  makeFrameworks,
  makeFramework
}