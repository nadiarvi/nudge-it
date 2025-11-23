const HttpError = class extends Error {
  constructor(message, errorCode, errorData) {
    super(message);
    this.code = errorCode;
    this.data = errorData;
  }
};

module.exports = HttpError;