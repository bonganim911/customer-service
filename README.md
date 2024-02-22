Table of Contents
=================

* [Customer transactions and related customers service](#Customer-transactions-and-related-customers-service)
    * [Minimum Requirements](#minimum-requirements)
* [Getting Started](#getting-started)
    * [Major Dependencies / Tools](#major-dependencies--tools)
    * [Checkout the Code](#checkout-the-code)
* [Setting up Prerequisites](#setting-up-prerequisites)
    * [npm setup](#npm-setup)
    * [Run service](#run-service)
* [Running Quality Gates and Build Commands](#running-quality-gates-and-build-commands)
    * [Unit Tests](#unit-tests)
* [Trade-off](#trade-off)


# Customer transactions and related customers service
 - Application that enriches transaction and related customer information data using an external api that provides sample data.

## Minimum Requirements
- Install node https://nodejs.org/en/download to use npm.

# Getting Started
This project Built using Node.js + Express + Typescript with Jest for testing and code coverage, 
and to integrate nodemon for automatic server restarts for dev, you can follow these steps:

## Major Dependencies / Tools

| Category                    | Command used   	                                 | Link                                                       	         |
|-----------------------------|--------------------------------------------------|----------------------------------------------------------------------|
| Express                     | npm install express                              | https://expressjs.com/en/starter/installing.html
| Typescript                  | npm install typescript @types/node @types/express | https://www.typescriptlang.org/        |
| Jest                        | npm install jest @types/jest ts-jest             | https://jestjs.io/                         |
| Axios                       | npm install axois                                | https://axios-http.com/docs/intro
| Supertest                   | npm install supertest --save-dev                 | https://www.npmjs.com/package/supertest           	                               |


## Checkout the Code

```bash
git clone https://github.com/bonganim911/customer-service.git
cd customer-service
```

# Setting up Prerequisites

## npm setup
- **npm install** given that you have node.js installed, instructions in Minimum requirement section.
- Run the below to install projects dependencies:
```bash
npm install
```

## Run Service
- Starts the development server with nodemon
```bash
npm run dev
```

- Compiles TypeScript files into JavaScript.
```bash
npm run build
```

- Starts the production server.
```bash
npm start
```

Runs the api in the development mode.<br />
Invoke [http://localhost:3000](http://localhost:8080) using [Postman](https://www.postman.com/downloads/) or CURL.

## Unit Tests
```bash
npm test
```

# Trade-Off
- Some service test could have covered edge cases.
- External api to fetch transactions could be put in .env file and read from there.


