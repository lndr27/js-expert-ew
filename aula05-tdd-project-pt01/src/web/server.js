"use strict";

const { join } = require('path');
const http = require('http');
const BaseRepository = require('../repositories/base-repository');
const CarService = require('../services/car-service');

const carsDatabase = join(__dirname, './../../database', 'cars.json');
const carService = new CarService({ cars: carsDatabase });

const customersDatabase = join(__dirname, './../../database', 'customers.json');
const customerRepository = new BaseRepository({ file: customersDatabase });

const carCategoryDatabase = join(__dirname, './../../database', 'car-categories.json');
const categoryRepository = new BaseRepository({ file: carCategoryDatabase });

const routes = {
  '/car/rent:post': async (req, res) => {    
    const customer = await customerRepository.find(req.body.customer);
    const category = await categoryRepository.find(req.body.category);
    const numberOfDays = Number(req.body.numberOfDays);
    
    const receipt = await carService.rent(customer, category, numberOfDays);
    res.writeHead(200, {
      'Content-Type': 'text/json'
    });
    res.write(JSON.stringify(receipt));
    return res.end();
  },
  default: (req, res) => {
    console.log('foo');
    res.writeHead(404);
    res.write('Not Found');
    return res.end();
  }
}

const handler = function (req, res) {
  const { url, method } = req;
  const routekey = `${url}:${method.toLowerCase()}`;
  const choosen = routes[routekey] || routes.default;  

  if (method.toLowerCase() === 'post') {
    req.on('data', chunk => {
      req.body = JSON.parse(chunk);
      choosen(req, res);
    });
  }
  else {
    choosen(req, res);
  }
  
}

const app = http.createServer(handler)
app.listen(3000, () => console.log('App running at', 3000));

module.exports = app;