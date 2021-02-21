const BaseRepository = require('../repositories/base-repository');
const Tax = require('../entities/tax');
const Receipt = require('../entities/receipt');

class CarService {
  constructor({ cars }) {
    this.carRepository = new BaseRepository({ file: cars });
    this.taxByAge = Tax.taxByAge;
    this.currencyFormater = new Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  getRandomPositionFromArray(arr) {
    return Math.floor(Math.random() * (arr.length));
  }

  getRandomCar(carCategory) {
    const randomCarIndex = this.getRandomPositionFromArray(carCategory.carIds);
    const carId = carCategory.carIds[randomCarIndex];
    return carId;
  }

  async getAvailableCar(carCategory) {
    const carId = this.getRandomCar(carCategory);
    const car = await this.carRepository.find(carId);
    return car;
  }

  calculateRentingPrice(customer, carCatetory, numberOfDays) {
    const { age } = customer;
    const { price } = carCatetory;
    const { then: tax } = this.taxByAge.find((t) => age >= t.from && age <= t.to);
    return  this.currencyFormater.format((price * tax) * numberOfDays);
  }

  async rent(customer, carCategory, numberOfDays) {
    const car = await this.getAvailableCar(carCategory);
    const finalPrice = this.calculateRentingPrice(customer, carCategory, numberOfDays);
    const today = new Date();
    today.setDate(today.getDate() + numberOfDays);
    return new Receipt({
      car,
      customer,
      price: finalPrice,
      dueDate: today.toLocaleDateString('pt-br', { year: 'numeric', month: 'long', day: 'numeric' })
    });
  }
}

module.exports = CarService;