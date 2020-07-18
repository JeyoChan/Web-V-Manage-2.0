class WVResult {
  constructor (suc, result) {
    this.suc = suc;
    if (suc) {
      this.data = result;
    } else {
      this.err = result;
    }
  }
}

module.exports = {
  WVResult
};