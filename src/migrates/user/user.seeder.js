const seeder = require('mongoose-seed');
const faker = require('faker');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
async function hash(str) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(str, salt);
    return hash;
}
module.exports = UserSeeder = async () => {
    const limit = 100;
    const users = [];
    for (let i = 0; i < limit; i++) {
        const newUser = {
            email: faker.internet.email(),
            full_name: faker.name.firstName() + ' ' + faker.name.lastName(),
            password: 'abc123',
            teams: [],
            date_of_birth: faker.date.past()
        };
        newUser.password = await hash(newUser.password);
        users.push(newUser);
    }
    let data = [{
        'model': 'User',
        'documents': users
    }];
    seeder.setLogOutput(true);
    seeder.connect('mongodb://localhost:27017/uit-ctf-time', () => {
        seeder.loadModels([
            'src/migrates/user/user.model'  // load mongoose model 
        ]);
        seeder.clearModels(['User'], function () {
            seeder.populateModels(data, function () {
                seeder.disconnect();
            });
        });
    });
}
UserSeeder();