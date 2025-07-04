const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OUSchema = new Schema({
  name: { type: String, required: true, unique: true },
  divisions: [{ type: Schema.Types.ObjectId, ref: 'Division' }],
});

module.exports = mongoose.model('OU', OUSchema);
