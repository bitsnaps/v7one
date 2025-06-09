# API Documentation

## DB Migration

The following JavaScript code is used to create the migration config of the database:
```js
require('dotenv').config({ path: '../.env' }); // Adjust if needed

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: './7vdb.sqlite', // Relative to the 'api' directory
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // This might be needed for some cloud providers like Heroku
      },
    },
    logging: false,
  },
};
```

## Run migrations
```bash
npx sequelize-cli db:migrate
```

## Undo migrations
```bash
npx sequelize-cli db:migrate:undo:all
```
## Troubleshooting
In some cases (e.g. In case of partially successful migrations), you might need to drop the database and recreate it. This can be done by running the following commands:
```bash
npx sequelize-cli db:drop
npx sequelize-cli db:create
```
**Notes:**
- This will drop all data from the database.
- If you encounter issues with the migrations, you might need to drop the `SequelizeMeta` table. This table is used to keep track of which migrations have been applied.
```bash
npx sequelize-cli db:migrate:undo:all --to 0
```
- Some SQL Dialects (e.g. `sqlite`) do not support `db:create` and `db:drop` commands.

- You might need to inspect the `SequelizeMeta` table to see which migrations have been applied and which haven't.

## Custom migration file:
If you have a custom migration file:
```bash
npx sequelize-cli db:migrate:undo:all --to <migration_file_name>.js
```
## Create seeds
This will create `XXXXXXXXXXXXXX-admin-user.js` file under `seeders` directory:
```bash
npx sequelize-cli seed:generate --name admin-user
```

## Run seeds    
```bash
npx sequelize-cli db:seed:all
```
## Undoing Seeds
Seeders can be undone if they are using any storage. There are two commands available for that:

If you wish to undo the most recent seed:

```bash
npx sequelize-cli db:seed:undo
```
If you wish to undo all seeds:
```bash
npx sequelize-cli db:seed:undo:all
```

## Help
```bash
npx sequelize --help
```

## Run the server
```bash
pnpm start
```

# Tutorial:

## Creating the first Model (and Migration)
Once you have properly configured CLI config file you are ready to create your first migration. It's as simple as executing a simple command.

We will use `model:generate` command. This command requires two options:

`name`: the name of the model;
`attributes`: the list of model attributes.

Let's create a model named `User`:
```bash
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
```
This will:
- Create a model file user in models folder;
- Create a migration file with name like `XXXXXXXXXXXXXX-create-user.js` in migrations folder.
