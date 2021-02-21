const request = require("supertest");
const { describe, it } = require("mocha");
const app = require("../../src/web/server");
const { expect } = require("chai");

const currencyFormater = new Intl.NumberFormat('pt-br', {
  style: 'currency',
  currency: 'BRL'
});

describe("API Endpoint", () => {
  it("Should return receipt with status code 200 (OK)", async () => {
    const response = await request(app).post("/car/rent").set('Accept', 'text/json').send({
      customer: "9f7a2135-79b6-4355-a510-5bd306d7eea2",
      category: "c1f700b0-c13f-467c-b71c-7d9eb3ba5ade",
      numberOfDays: 5,
    }).expect(200);
    const receipt = JSON.parse(response.text);
    expect(receipt).to.not.be.undefined;
    expect(receipt.price).to.be.equal(currencyFormater.format(244.40), 'fooo');
  });

  it ('Should return not found for anything other than car/rent', async () => {
    const response = await request(app).get("/foo").expect(404);
    console.log(response.text);
  });
});