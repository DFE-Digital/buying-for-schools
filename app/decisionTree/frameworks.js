const makeFrameworks = data => {
  const frameworks = data.map(frameworkdata => makeFramework(frameworkdata))
  Object.freeze(frameworks)
  return {
    get: (ref) => frameworks.find(f => f.getRef() === ref),
    getAll: () => frameworks
  }
}

const makeFramework = frameworkdata => {
  const { ref, title, supplier, url, cat, descr = "", expiry = "" } = frameworkdata
  return {
    getRef: () => ref,
    getTitle: () => title,
    getSupplier: () => supplier,
    getUrl: () => url,
    getCategory: () => cat,
    getDescr: () => descr,
    getExpiry: () => expiry,
    toObject: () => {
      return {
        ref,
        title,
        supplier,
        url,
        cat,
        descr,
        expiry
      }
    }
  }
}

module.exports = {
  makeFrameworks,
  makeFramework
}