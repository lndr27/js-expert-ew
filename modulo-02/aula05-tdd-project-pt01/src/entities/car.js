const Base = require('./base');

class Car extends Base {
  constructor({ id, name, releasedYear, available, gasAvailable }) {
    super({id, name});
    this.releasedYear = releasedYear;
    this.available = available;
    this.gasAvailable = gasAvailable;
  }
}
module.exports = Car;