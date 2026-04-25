// Returns an empty ES module for any file — used to ignore Payload SCSS imports
module.exports = function () {
  return 'export default {};'
}
