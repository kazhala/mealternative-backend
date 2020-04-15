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
   Detailed explanation [here](#mongodb-setup)

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
npm run dev
```

6. Break Everything:)

### MongoDB setup

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

### SendGrid setup

> SendGrid is a fully managed fantastic email service, you get a huge amount of free tier usage as well

1. Register a free account at [SendGrid](https://sendgrid.com/)
2. Leave everything as default, you do not need to configure anything
   > The backend uses the [NPM](https://www.npmjs.com/package/@sendgrid/mail) package sendgrid provide
3. Navigate to the API keys section
4. Create a new API Key
   ![](https://user-images.githubusercontent.com/43941510/78725463-f319ac00-7972-11ea-8651-3c7ad1466e6a.png)
5. Copy the API key and put it in the .env file mentioned in Step4 of [Usage](https://github.com/kazhala/mealternative-backend#Usage)

## Deployment and Hosting

### Frontend

The frontend of this project is hosted on an AWS s3 bucket and distributed through CloudFront.
[Here](https://github.com/kazhala/AWSCloudFormationStacks/blob/master/Hosting_frontend_S3.yaml) is the custom cloudformation deployment template.

### Backend

The backend of this project is hosted on AWS ec2 instance through elastic beanstalk. [Here](https://github.com/kazhala/AWSCloudFormationStacks/blob/master/Hosting_backend_nodejs.yaml) is the custom deployment cloudformation template.

### Using the template

> Note: Backend template is intended to use with registered domain and a static frontend with the frontend template. If you are looking for deploying a nodejs backend without involvement of route53 on AWS, simply google mern stack AWS, there's so many different ways

> This template demonstrate how to setup elasticbeanstalk through cloudformation, you could of course install elasticbeanstalk cli and use it differently

1. Frontend template usage is [here](https://github.com/kazhala/mealternative-backend)
2. If you haven't use elasticbeanstalk before or don't have a elasticbeanstalk dedicated S3 bucket, run this command

```bash
aws elasticbeanstalk create-storage-location
```

3. Zip up the entire code

```bash
git archive -v -o mealternative.zip --format=zip HEAD
```

4. Upload the zip file to the s3 bucket created by step2
   > It is suggested to create a sub "folder" in s3 to hold each application, e.g. s3://elasticbeanstalk/mealternative/yourzip

```bash
aws s3 mv mealternative.zip s3://<Yourelasticbeanstalkbucket>/mealternative/mealternative.zip
```

5. Download the backend template and modify all of [this](https://github.com/kazhala/AWSCloudFormationStacks/blob/e1b9069a52a0ee3609ae170dbcce0dbbd9584c4b/Hosting_backend_nodejs.yaml#L102) values
   > Change all of the {{resolve:ssm:/mealternative/XXX:1}} to the env variables in your .env file.
   > If you have experience with AWS system manager, you could just go to system manager and create the appropriate the parameters in parameter store

```yaml
- Namespace: aws:elasticbeanstalk:application:environment
  OptionName: PORT
  Value: <YourValue>
- Namespace: aws:elasticbeanstalk:application:environment
  OptionName: CLIENT_URL
  Value: <YourValue>
# And change all of the rest with {{resolve:ssm:/mealternative/XXX:1}} to your value
```

6. Register a SSL certificate through ACM in your region, rather than the us-east-1 mentioned in frontend template

   > Used for https connections between frontend and backend

7. Create a cloudformation stack with the modified template

   - ApplicationName: Any name you prefer
   - S3ZipKey: the path of your zip file in s3 elasticbeanstalk bucket (E.g. In this setup example, mealternative/mealternative.zip)
   - KeyPair: an existing EC2 key pair, if you don't have one, create one in EC2 console
   - SSLCertificateArn: ssl certificate arn from step 6
   - HostedZoneId: the route53 hosted zone that hosts your domain name
   - FrontendStack: reference the name of the frontend stack

8. Once the stack is created, your backend should be live
