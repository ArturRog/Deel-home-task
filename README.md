# My summary

Basic implementation - all endpoints + test setup with test cases for `contracts` took me ~2:50h. 
I went ahead and added some improvements. The initial version is up to this commit https://github.com/ArturRog/Deel-home-task/commit/5a0a609c99955d837ec21223450058196c7af527

What I'd change or add:
- Separation of layers; isolate layer for db operations
- Minor code refactors e.g. wrap `services` in classes, build a factory around it. Better and easier testability.
- Better error handling (update: added in this commit https://github.com/ArturRog/Deel-home-task/commit/38aa1cd440ddef8d95fea84e388fc717c6b5925c)
  - async-error-handler will take care of async function errors (implemented), 
  - custom error handler as a middleware - more human-friendly error messages, with proper Http statuses (update: added)
- Tests
  - Cover all major APIs
    - Update: job routes covered in this commit https://github.com/ArturRog/Deel-home-task/commit/6166aea05ae3d0ba5d5e68189f2f82822bc86a61
    - Update: balance routes covered in this commit https://github.com/ArturRog/Deel-home-task/commit/ceeeada4b13a6290f23f33a8c88a3a920944c7f2
    - Update: admin routes covered in this commit https://github.com/ArturRog/Deel-home-task/commit/ac4387195ade33b3947cbe53e739e754433d76ff
  - More granular - unit tests
  - Extract test utilities e.g. better setup of in-memory db (instead of calling provided `seed` method)
- I assumed *all* endpoints requires verification, but this is not an requirement. I'd clarify that one and left only where it is needed. E.g. admin endpoints doesn't really require `profile_id` but they might need some other kind of verification (JWT)

# DEEL BACKEND TASK

  

💫 Welcome! 🎉


This backend exercise involves building a Node.js/Express.js app that will serve a REST API. We imagine you should spend around 3 hours at implement this feature.

## Data Models

> **All models are defined in src/model.js**

### Profile
A profile can be either a `client` or a `contractor`. 
clients create contracts with contractors. contractor does jobs for clients and get paid.
Each profile has a balance property.

### Contract
A contract between and client and a contractor.
Contracts have 3 statuses, `new`, `in_progress`, `terminated`. contracts are considered active only when in status `in_progress`
Contracts group jobs within them.

### Job
contractor get paid for jobs by clients under a certain contract.

## Getting Set Up

  
The exercise requires [Node.js](https://nodejs.org/en/) to be installed. We recommend using the LTS version.

  

1. Start by cloning this repository.

  

1. In the repo root directory, run `npm install` to gather all dependencies.

  

1. Next, `npm run seed` will seed the local SQLite database. **Warning: This will drop the database if it exists**. The database lives in a local file `database.sqlite3`.

  

1. Then run `npm start` which should start both the server and the React client.

  

❗️ **Make sure you commit all changes to the master branch!**

  
  

## Technical Notes

  

- The server is running with [nodemon](https://nodemon.io/) which will automatically restart for you when you modify and save a file.

- The database provider is SQLite, which will store data in a file local to your repository called `database.sqlite3`. The ORM [Sequelize](http://docs.sequelizejs.com/) is on top of it. You should only have to interact with Sequelize - **please spend some time reading sequelize documentation before starting the exercise.**

- To authenticate users use the `getProfile` middleware that is located under src/middleware/getProfile.js. users are authenticated by passing `profile_id` in the request header. after a user is authenticated his profile will be available under `req.profile`. make sure only users that are on the contract can access their contracts.
- The server is running on port 3001.

  

## APIs To Implement 

  

Below is a list of the required API's for the application.

  


1. ***GET*** `/contracts/:id` - This API is broken 😵! it should return the contract only if it belongs to the profile calling. better fix that!

1. ***GET*** `/contracts` - Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.

1. ***GET*** `/jobs/unpaid` -  Get all unpaid jobs for a user (***either*** a client or contractor), for ***active contracts only***.

1. ***POST*** `/jobs/:job_id/pay` - Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.

1. ***POST*** `/balances/deposit/:userId` - Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)

1. ***GET*** `/admin/best-profession?start=<date>&end=<date>` - Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.

1. ***GET*** `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` - returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied, default limit is 2.
```
 [
    {
        "id": 1,
        "fullName": "Reece Moyer",
        "paid" : 100.3
    },
    {
        "id": 200,
        "fullName": "Debora Martin",
        "paid" : 99
    },
    {
        "id": 22,
        "fullName": "Debora Martin",
        "paid" : 21
    }
]
```

  

## Going Above and Beyond the Requirements

Given the time expectations of this exercise, we don't expect anyone to submit anything super fancy, but if you find yourself with extra time, any extra credit item(s) that showcase your unique strengths would be awesome! 🙌

It would be great for example if you'd write some unit test / simple frontend demostrating calls to your fresh APIs.

  

## Submitting the Assignment

When you have finished the assignment, create a github repository and send us the link.

  

Thank you and good luck! 🙏
