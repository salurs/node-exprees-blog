const bcrypt = require('bcrypt');

async function createAdmin(){
    const pass = await bcrypt.hash('orhansalur', 10);
    const admin = {
        name: 'Orhan',
        surname: 'SALUR',
        username: 'orhss',
        email: 'orhsssalur@gmail.com',
        password: pass,
        role: '1',
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    return admin;
}


module.exports.createAdmin = createAdmin;