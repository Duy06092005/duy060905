const mysql = require('mysql2');

// Cấu hình kết nối tới MySQL (Local hoặc Aiven Cloud)
const pool = mysql.createPool({
    host: '127.0.0.1', // Đổi thành Host URL nếu bạn dùng Aiven Cloud
    port: 3306,
    user: 'root',      // Đổi thành user của Aiven nếu dùng Cloud
    password: 'mat_khau_cua_ban', // Thay bằng mật khẩu MySQL của bạn
    database: 'BoardingHouseDB',  // Tên CSDL bạn đã tạo
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error(' Lỗi kết nối CSDL:', err.message);
    } else {
        console.log(' Kết nối CSDL BoardingHouseDB thành công!');
        connection.release();
    }
});

module.exports = pool.promise();