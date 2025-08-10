const { Pool } = require('pg');

const pool = new Pool();

exports.query = (text, params) => {
  return pool.query(text, params);
};

exports.client = () => {
  return pool.connect();
};