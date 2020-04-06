# Mealternative (Backend)

The backend repo which powers up [mealternative](https://github.com/kazhala/mealternative).
It mainly handles all actions related to authentication, recipe operation and user informations.

Project URL: https://mealternative.com/

- CRUD with mongoDB using mongoose
- custom auth implementation using jwt without using a fully managed service
- Multi user posting and interacting (likes, bookmarks etc)
- Pagination and randomise display recipe
- Sorting based on all sorts of different criteria

## Introduction

This project is not built for production usage, I've built this website maily to refresh
my knowledge on the MERN stack. Some of the functionality implementation may not be best
practice (like building a auth system myself..). However, this project does showcase how
to effectively interact with mongoDB using mongoose, hopefully you could find something
useful from this repo. Maybe also take a close look at the frontend [repo](https://github.com/kazhala/mealternative).

## Usage

To set this up locally, please follow the steps below

1. Clone the repository
2. Go into the directory where the package.json resides
3. Install dependencies

```bash
npm install
```

4. Create the required .env file with below environment variables in it. Note: you will need to use
   one of your existing [mongoDB](https://www.mongodb.com/) cluster or create a new cluster as well
   as a [sendgrid](https://sendgrid.com/) API key. Freetier is more than enough for both of this.
   Detailed explanation [here](https://github.com/kazhala/mealternative-backend#MongoDB-setup)

```bash
cat << EOF > .env
PORT=8000
CLIENT_URL=http://localhost:3000
DATABASE=<Your mongodb connect url>
SENDGRID_API_KEY=<Your sendgrid API>
JWT_ACCOUNT_ACTIVATION=asfbb1onofnonodsnonono
JWT_SECRET=adsfasdfbbi1bibibjbdksmmmoo
JWT_RESET_PASSWORD=uuiuinjjbywyeyqwgvb
EMAIL_FROM=noreply@mealternative.com
EOF
```

5. Start the server (server will be running in port 8000)

```bash
npm start
```

6. Break Everything:)

## MongoDB setup

> You can use a local mongo setup, this part only demonstrate how to set up mongoDB atlas

1. create a new project and then build a new cluster
2. Select free tier and then create a cluster
3. Select provider of your choice and a region close to you, leave the rest as default
   Note: make sure to select M0 sandbox tier(It's free)
   ![](https://user-images.githubusercontent.com/43941510/78612039-b5058500-78ab-11ea-8eb7-dcb09409bfc2.png)
4. Click connect
   ![](https://user-images.githubusercontent.com/43941510/78612117-ed0cc800-78ab-11ea-916e-9d90ade1e3e9.png)
5. Add your IP to the ip whitelist and create a mongo user for the cluster (remember the username and password)
   ![](https://user-images.githubusercontent.com/43941510/78612578-06624400-78ad-11ea-87b5-f67bc82995cb.png)
6. Select 'Connect your application'
   ![](https://user-images.githubusercontent.com/43941510/78612691-504b2a00-78ad-11ea-9d2b-d79909aa413b.png)
7. Make sure the Driver is Node.js and copy the mongoDB connection string with your new mongo user's username and password (created in step 5)
8. Put the mongoDB connection string into the .env file
