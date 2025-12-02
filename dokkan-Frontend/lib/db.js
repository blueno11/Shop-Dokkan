import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin', // Thay bằng mật khẩu MySQL của bạn
  database: 'Shopdokkan',
}); 