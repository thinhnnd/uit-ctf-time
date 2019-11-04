const seeder = require('mongoose-seed');
const faker = require('faker');
const mongoose = require('mongoose');
const _ = require('lodash');

const User = require('../user/user.model');

new Promise(resolve => {
    mongoose.connect('mongodb://localhost:27017/ctf_api');
    async.parallel([
        callback => {
            User.find({}, { _id: 1 }, (err, user) => {
                callback(null, user);
            })
        }, (err, result) => {
            resolve(result);
            mongoose.connection.close();
        }
    ])
})
    .then(result => {
        return new Promise((resolve, reject) => {
            const limit = 100;
            const teams = [];
            for (let i = 0; i < limit; i++) {
                const newTeam = {
                    teamName: faker.name.title,
                    leader: _.sample(result)._id,
                    members: [],
                    eventsRegistration: [],
                    teamEventStatusId: [],
                }
                for (let j = 0; j < 5; j++) {
                    newTeam.members.push(_.sample(result)._id);
                }
                teams.push(newTeam);
            }
            resolve(teams);
            let data = [{
                'model': 'Team',
                'documents': teams,
            }];
            seeder.setLogOutput(true);
            seeder.connect('mongodb://localhost:27017/uit-ctf-time', () => {
                seeder.loadModels([
                    'src/migrates/team/team.model'  // load mongoose model 
                ]);
                seeder.clearModels(['Team'], function () {
                    seeder.populateModels(data, function () {
                        seeder.disconnect();
                    });
                });
            });
        })
    })

module.exports = TeamSeeder = async () => {

}