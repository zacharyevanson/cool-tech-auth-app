const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const OU = require('./models/OU');
const Division = require('./models/Division');
const CredentialRepository = require('./models/CredentialRepository');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cooltechauth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seed() {
  await User.deleteMany({});
  await OU.deleteMany({});
  await Division.deleteMany({});
  await CredentialRepository.deleteMany({});

  // Define OUs
  const ouNames = [
    'News management',
    'Software reviews',
    'Hardware reviews',
    'Opinion publishing',
  ];

  // Define division names
  const divisionNames = [
    'Finances', 'IT', 'Writing', 'Development', 'Design', 'SEO', 'Content', 'Support', 'QA', 'Marketing', 'Research',
  ];

  // Create OUs and Divisions
  const ous = [];
  const allDivisions = [];
  for (const ouName of ouNames) {
    const ou = await OU.create({ name: ouName });
    const divisions = [];
    for (const divName of divisionNames) {
      const division = await Division.create({ name: `${ouName} - ${divName}`, ou: ou._id });
      const repo = await CredentialRepository.create({
        division: division._id,
        credentials: [
          { name: 'WP Site', value: 'user1/wp-pass' },
          { name: 'Server', value: 'user2/server-pass' },
        ],
      });
      division.credentialRepository = repo._id;
      await division.save();
      divisions.push(division._id);
      allDivisions.push(division);
    }
    ou.divisions = divisions;
    await ou.save();
    ous.push(ou);
  }

  // Hash passwords
  const hash = async (pw) => await bcrypt.hash(pw, 10);

  // Create users
  // Normal user in one OU/division
  const normalUser = await User.create({
    username: 'normaluser',
    password: await hash('password'),
    role: 'user',
    divisions: [allDivisions[0]._id],
    ous: [ous[0]._id],
  });
  // User in multiple OUs/divisions
  const multiUser = await User.create({
    username: 'multidivuser',
    password: await hash('password'),
    role: 'user',
    divisions: [allDivisions[1]._id, allDivisions[12]._id],
    ous: [ous[0]._id, ous[1]._id],
  });
  // Management user
  const manager = await User.create({
    username: 'manager',
    password: await hash('password'),
    role: 'manager',
    divisions: [allDivisions[2]._id],
    ous: [ous[0]._id],
  });
  // Admin user
  const admin = await User.create({
    username: 'admin',
    password: await hash('admin'),
    role: 'admin',
    divisions: allDivisions.map(d => d._id),
    ous: [ous[0]._id],
  });

  console.log('Seed complete');
  mongoose.disconnect();
}

seed();
