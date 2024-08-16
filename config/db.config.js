import mysql from 'mysql2/promise';


const db = mysql.createPool({
  host: 'veganningdb.cpg8ueqwc4ly.ap-northeast-2.rds.amazonaws.com',     // 예: 'localhost'
  user: 'root',     // 예: 'root'
  password: 'abcd1234', // 예: 'password'
  database: 'veganning'  // 예: 'mydatabase'
});

export default db;