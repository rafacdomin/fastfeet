# FastFeet API Server :incoming_envelope:

NodeJS API developed on [RocketSeat GoStack Bootcamp](https://rocketseat.com.br/bootcamp). Check the
[Web Version](https://github.com/rafacdomin/fastfeet-web) and the [Mobile Version](https://github.com/rafacdomin/fastfeetgobarber-mobile) made with React Native.

- [FastFeet API Server :incoming_envelope:](#fastfeet-api-server-incoming_envelope)
  - [About](#about)
  - [Technologies](#technologies)
  - [How To Use](#how-to-use)
  - [License](#license)
  - [Author](#author)

![FastFeet SignIn]()

## About

This project is based on an application for a shipping company with admin authentication,
recipients, deliveryman and orders management.

## Technologies

This project was developed with the following technologies:

- [NodeJS](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Multer](https://github.com/expressjs/multer)
- [JSON Web Token](https://jwt.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [date-fns](https://date-fns.org/)
- [Cors](https://www.npmjs.com/package/cors)
- [bcrypt.js](https://www.npmjs.com/package/bcryptjs)
- [bee-queue](https://github.com/bee-queue/bee-queue)
- [Nodemailer](https://nodemailer.com/about/)
- [Sequelize v6](https://sequelize.org/master/)
- [Yup](https://github.com/jquense/yup)
- [Sucrase](https://github.com/alangpierce/sucrase)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Editor Config](https://editorconfig.org/)

## How To Use

Import the `Insomnia_fastfeet.json` on Insomnia App

To clone and run this application, you'll need:

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/)
- [Yarn v1](https://classic.yarnpkg.com/)
- One instance of [PostgreSQL](https://www.postgresql.org/).

> Obs.: I recommend use docker.

Follow the steps below:

```bash
# Clone this repository
$ git clone https://github.com/rafacdomin/gobarber-server

# Go into the repository
$ cd gobarber-server

# Install dependencies
$ yarn

# Create the instance of postgreSQL using docker
$ docker run --name fastfeet-postgres -e POSTGRES_USER=docker \
              -e POSTGRES_DB=fastfeet -e POSTGRES_PASSWORD=docker \
              -p 5432:5432 -d postgres

# Create the instance of redis using docker
$ docker run --name fastfeet-redis -p 6379:6379 -d -t redis:alpine
```

Make a copy of `.env.example` to `.env` and set YOUR enviroment variables

```bash

# Run the server
$ yarn dev
```

## License

This project is under the MIT license. See the [LICENSE](https://github.com/rafacdomin/fastfeet-server/blob/master/LICENSE) for more information.

---

## Author

<img  border-radius="50px" src="https://avatars3.githubusercontent.com/u/40310160?s=460&u=d2babe9b7f1c365955699550074910a1957525c8&v=4" width="100px" alt="Author"/>

Made with :purple_heart: by Rafael Domingues :wave: [Get in touch!](https://www.linkedin.com/in/rafaelcodomingues/)

[![Linkedin Badge](https://img.shields.io/badge/-Rafael_Domingues-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/rafaelcodomingues/)](https://www.linkedin.com/in/rafaelcodomingues/)
[![Gmail Badge](https://img.shields.io/badge/-rafaelcodomingues@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:rafaelcodomingues@gmail.com)](mailto:rafaelcodomingues@gmail.com)
[![DEV.to Badge](https://img.shields.io/badge/DEV.to-rafacdomin-black)](https://dev.to/rafacdomin)
[![GitHub followers](https://img.shields.io/github/followers/rafacdomin?label=Follow&style=social)](https://github.com/rafacdomin/?tab=follow)
