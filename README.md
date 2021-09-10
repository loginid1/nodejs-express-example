# nodejs-express-example

## Requirements

- Nodejs
- npm

## env

A .env file is needed in the directory with the following:

```
BASE_URL=                  #This is the base url value found on the dashboard.
WEB_CLIENT_ID=             #This is a Web client ID (no credential).
MANAGEMENT_CLIENT_ID=      #This is a Backend client ID with a credential attached to it.
PRIVATE_KEY=               #This is the private key associated with <MANAGEMENT_CLIENT_ID>.
```

## How to Run

```
git clone https://github.com/loginid1/nodejs-express-example.git
cd nodejs-express-example
npm install
npm start
```

Project will now be found at [http://localhost:3000](http://localhost:3000).

## How to Run with Docker

1. Create and fill up .env file from above.
2. Enter `docker-compose up`
3. Project will now be found at [http://localhost:3000](http://localhost:3000).
