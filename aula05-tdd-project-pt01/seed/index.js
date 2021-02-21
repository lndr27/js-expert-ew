const faker = require('faker');
const Car = require('../src/entities/car');
const CarCategory = require('../src/entities/car-category');
const Customer = require('../src/entities/customer');
const { join } = require('path')
const { writeFile } = require('fs/promises')

const carCategory = new CarCategory({
  id: faker.random.uuid(),
  name: faker.vehicle.type(),
  carIds: [],
  price: faker.finance.amount(20, 100)
});

const ITEMS_AMOUNT = 2;
const cars = [];
const customers = [];
for (let i = 0; i < ITEMS_AMOUNT; ++i) {
  const car = new Car({
    id: faker.random.uuid(),
    name: faker.vehicle.model(),
    available: true,
    gasAvailable: true,
    releasedYear: faker.date.past().getFullYear()
  });
  cars.push(car);
  carCategory.carIds.push(car.id);
  
  customers.push(new Customer({
    id: faker.random.uuid(),
    name: faker.name.findName(),
    age: faker.random.number(18, 50)
  }))
}


const seederBasePath = join(__dirname, '../', 'database');

const write = (filename, data) => writeFile(join(seederBasePath, filename), JSON.stringify(data));

(async () => {

  await write('cars.json', cars);
  await write('car-categories.json', [carCategory]);
  await write('customers.json', customers);

})();