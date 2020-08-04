## Installation

Before start development, [download and install Node.js](https://nodejs.org/en/download/). Node.js 0.10 or higher is required.

## Getting started

Clone this project to start development on a new service.

```
$ git clone https://github.com/git-allcard/acc-filconnect-services-structure.git
```

Open the project with your favorite IDE and run this command:

```
$ npm install
```

_This command will download all dependencies required for our project._

Go to your `package.json` and modify your project name.

```
{
	"name": "replacethiswithyourservicename",
	"version": "1.0.0",
	"description": "",
	.......
}
```

### Configuration

Create your configuration go to `.evn` and change your application name:

```
LOG_LEVEL='debug'
CLOUD_CONFIG_URL='http://172.16.7.72:8082'
CLOUD_CONFIG_APP_NAME='replaceapplicaitonname'
```

**Note: that your configuration must exist @ ->**[https://github.com/git-allcard/acc-filconnect-configuration](https://github.com/git-allcard/acc-filconnect-configuration)

To test your configuration via browser and visit your config:

[http://lbconfiguration-796183350.ap-southeast-1.elb.amazonaws.com:7071/`applicationname`/default](http://lbconfiguration-796183350.ap-southeast-1.elb.amazonaws.com:7071/authorization/default)

ex.[http://lbconfiguration-796183350.ap-southeast-1.elb.amazonaws.com:7071/authorization/default](http://lbconfiguration-796183350.ap-southeast-1.elb.amazonaws.com:7071/authorization/default)

### Run app

When setup and configuration are okay run your app:

```
$npm run dev
```

## Deployment

To deploy application it must be on our git repository. Please ask assistance for repo creation.

### Build

Building our package:

```
$npm run build
$npm start
```

Run application on docker

```
$docker build -t notification-app .
$docker run -p 8080:8080 notification-app
```

_Note: If you already apply update 1.0.3 skip the building process._

- dockerfile
- .dockerignore
- docker-compose.yml

You can run this command to deploy on your instance.

```
$sudo docker-compose up
```

### Deployment

Check your remote origin before commiting changes:

```
$git remote -v
```

This will show all the remote on our .git make sure your pushing on the rigth repository.

Always pull latest update before pushing on master:

```
$git pull origin master
```

Validate any conflicts on our repo before commiting changes.

```
$git add .
$git commit -m 'this is my updated feature 1 enable'
$git push origin master
```

## What you should know?

### File structure

│ .env # environment variable for configuration url and application name.  
│ app.ts # App entry point  
└───api # Express route controllers for all the endpoints of the app  
└───config # Environment variables and configuration related stuff  
└───entity # Database models  
└───helpers # Utility  
 \*└───constants.ts # Constant variables.  
└───loaders # Split the startup process into modules  
\*└───camunda # We initialize here the camunda connection and the subscription.  
\*└───dependencyInjection # Inject all the services here.  
\*└───eureka # application registration on service registry.  
\*└───express # express intialization process.  
\*└───logger # Logger instance and configuration.  
\*└───typeORM # Initialization for our database configuration.  
└───services # All the business logic is here  
└───subscription # Event handlers for camunda.  
└───viewmodel # Payload model and custom validations.

---

### Coding Case

/api - `Pascal`  
/entity - `camelCase`  
/helpers - `Pascal`  
/loaders - `Pascal`  
/services - `Pascal`  
/subscription - `Pascal`  
/viewmodel - `camelCase`

---

### Database

Our database design has strict policy on identifier.  
`id` - a primary key of a table formatted as `bigint` that can be store as a foreign key for relationship on same database only. Its purpose is for internal process only and must not expose to the public.  
`uuid` - a `uniqueidentifier` used for relationship of other micro-services and can be used externally.

_Note: `id` must not expose externally_

For more inquiry please contact support@allcardtech.com.ph

---

### Updates

### 1.0.1 by Jhon Christopher E. Cabili on May 22, 2020

```
Update naming case on:
/api - `Pascal`
/entity - `camelCase`
/helpers - `Pascal`
/loaders - `Pascal`
/services - `Pascal`
/subscription - `Pascal`
/viewmodel - `camelCase`
Enhance entity implements lowecase naming convention for database table and columns.
Change guid to uuid aswell converted it from primary to unique only.
Update README.md add more detailed for user.
```

---

### 1.0.2 by Jhon Christopher E. Cabili on May 28, 2020

#### camundaService.ts # additional variable headers

```
 public async Start(
    payload: string,
    headers: string,
    processDefinitionID: string
  ) {
    const cloudConfig: client.Config = Container.get(SERVICE.CLOUD_CONFIG);
    const URL =
      cloudConfig.get(CONFIG.CAMUNDA.HOST) +
      `/process-definition/key/${processDefinitionID}/start`;

    const res = await axios.post(URL, {
      variables: {
        payload: {
          value: payload,
          type: "String",
        },
        headers: {
          value: headers,
          type: "String",
        },
      },
    });
    if (res.status === 200)
      return {
        id: res.data.id,
      };
  }
```

#### Constans.ts #varialbe constants

```
export const ORCHESTRATION = {
  ...
  VARIABLE: {
    PAYLOAD: "payload",
    HEADERS: "headers",
    RESPONSE: "response",
    STATUS: "status",
    ERROR_MESSAGE: "errorMessage",
    ERROR_CODE: "errorCode",
  },
};
```

#### docerkfile #Docker file to docker compose

```
FROM node:10.15.3
WORKDIR /release
COPY package.json /release
RUN npm install

COPY . /release
RUN ls
RUN npm run build

```

#### .dockerignore # ignore files.

```
node_modules
npm-debug.log
dist
logs
package-lock.json
```

#### docker-compose.yml #compose file for docker-compose up

```
version: "3"
services:
  example: # change by servicename
    build: .
    entrypoint: ["node", "dist/app.js"]
    ports:
      - "8080:8080"
```

#### Note use logger service to log everything.

git
