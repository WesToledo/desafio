# Desafio CopyBase

Project developed based on the challenge sent by Copybase for a Dev vacancy.

### Installation

Use [pip](https://pip.pypa.io/en/stable/) to install.

```bash

pip install python-dateutil

```

## Project Instalation

This project is a Monorepo built using TurboRepo. The **/api** has an NestJS project and the **/client** an Vite project using React + Typescript.
The database chosen was **Postgres** integrated with PRISMA as ORM.

Install with **npm**

```bash
  npm install

  # Docker
  npm run start:services

  # Dev Mode
  npm run dev
```

## TO-DO

 - Create automated tests
 - Write a better documentation 
 - Create validations for the extracted data from the .csv files.
