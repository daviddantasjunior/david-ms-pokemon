module.exports = {
  "type": process.env.DATABASE_TYPE,
  "host": process.env.DATABASE_HOST,
  "port": +process.env.DATABASE_PORT,
  "username": process.env.DATABASE_USERNAME,
  "password": process.env.DATABASE_PASSWORD,
  "database": process.env.DATABASE_NAME,
  "entities": ["dist/**/*.entity{.ts,.js}"],
  "synchronize": process.env.DATABASE_SYNC,
}
