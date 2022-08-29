# Recipe Together

An app that allows random people to create recipes together, not knowing what ingredients the others add.

![FVqxArKAcA](https://user-images.githubusercontent.com/25279396/187299771-27110bb2-ff2d-434f-8d35-8ecdeacd04c0.png)

## How it works

### How the data is stored:

Recipes or rooms are stored using RedisJSON and RedisOM.

### How the data is accessed:

Data is accessed using an index built at startup.

### Prerequisites

-   Node.js 16.17.0 LTS

## How to run it locally?

-   Clone the repository
-   Open two terminals, one in the backend folder, and one in the frontend folder
-   Run `npm install` in both terminals
-   Make a `.env` file in the backend folder with the following contents (Make sure to replace the value with your own):
    ```
    REDIS_URL=[YOUR REDIS CONNECT STRING]
    ```
-   To start the frontend, run `npm start` in the frontend terminal
-   For the backend, run `npm run watch` in the backend terminal

### Building

Frontend

-   Run `npm run build` in the frontend terminal

Backend

-   Run `npm run build` in the backend terminal

The build files can be accessed in the `build` folder for both the frontend and backend.
