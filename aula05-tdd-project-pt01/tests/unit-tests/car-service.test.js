const { describe, it, before, beforeEach, afterEach } = require('mocha');
const { expect } = require('chai');
const sinon = require('sinon');
const { join } = require('path');
const CarService = require('../../src/services/car-service');
const Receipt = require('../../src/entities/receipt');

const carsDatabase = join(__dirname, './../../database', 'cars.json');
const mocks = {
  validCar: require('../mocks/valid.car.json'),
  validCarCategory: require('../mocks/valid-car-category.json'),
  validCustomer: require('../mocks/valid.customer.json')
}

describe('CarService Suite Tests', () => {
  let carService = {}
  let sandbox = {};
  before(() => {
    carService = new CarService({
      cars: carsDatabase
    });
  });
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  })

  it('Should return random position from an array', () => {
    const data = [0, 1, 2, 3, 4];
    const result = carService.getRandomPositionFromArray(data);
    expect(result).to.be.lte(data.length).and.to.be.gte(0);
  })

  it('Should choose first id from carIds in carCategory', () => {
    const carCategory = mocks.validCarCategory;
    const carIdIndex = 0;

    sandbox.stub(
      carService,
      carService.getRandomPositionFromArray.name
    ).returns(0);

    const result = carService.getRandomCar(carCategory);
    const expected = carCategory.carIds[carIdIndex];

    expect(result).to.be.equal(expected);
    expect(carService.getRandomPositionFromArray.calledOnce).to.be.true;
  })

  it('Should return available car given a carCategory', async () => {
    const car = mocks.validCar;
    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.carIds = [car.id];

    sandbox.stub(
      carService.carRepository,
      carService.carRepository.find.name
    ).resolves(car);

    sandbox.spy(
      carService,
      carService.getRandomCar.name
    )

    const result = await carService.getAvailableCar(carCategory)
    const expected = car;

    expect(carService.getRandomCar.calledOnce).to.be.true;
    expect(result).to.be.deep.equal(expected);
  })

  it('Should calculate final renting price correctly and print value in brazilian reais', () => {
    const customer = Object.create(mocks.validCustomer);
    customer.age = 50;

    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.price = 37.6;

    const numberOfDays = 5;

    const result = carService.calculateRentingPrice(customer, carCategory, numberOfDays);

    const expected = carService.currencyFormater.format(244.4)

    expect(result).to.be.equal(expected);
  });

  it('Should return rent receipt given a customer and a car category', async () => {
    const car = mocks.validCar;
    const carCategory = {
      ...mocks.carCategory,
      price: 37.6,
      carIds: [car.id]
    };
    const customer = Object.create(mocks.validCustomer);
    customer.age = 50;

    const numberOfDays = 5;

    const today = new Date(2020, 10, 5);
    sandbox.useFakeTimers(today.getTime());

    sandbox.stub(carService.carRepository, carService.carRepository.find.name).resolves(car);

    const result = await carService.rent(customer, carCategory, numberOfDays);

    const expected = new Receipt({
      customer,
      car,
      price: carService.currencyFormater.format(244.4),
      dueDate: '10 de novembro de 2020'
    });

    expect(result).to.be.deep.equal(expected);
  })
})