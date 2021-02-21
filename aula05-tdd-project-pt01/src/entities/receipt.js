class Receipt {
  constructor({ customer, car, price, dueDate }) {
    this.customer = customer;
    this.car = car;
    this.price = price;
    this.dueDate = dueDate;
  }
}

module.exports = Receipt;