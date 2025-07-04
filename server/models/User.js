const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'manager'], default: 'user' },
  divisions: [{ type: Schema.Types.ObjectId, ref: 'Division' }],
  ous: [{ type: Schema.Types.ObjectId, ref: 'OU' }],
});

module.exports = mongoose.model('User', UserSchema);
