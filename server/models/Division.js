const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DivisionSchema = new Schema({
  name: { type: String, required: true, unique: true },
  ou: { type: Schema.Types.ObjectId, ref: 'OU' },
  credentialRepository: { type: Schema.Types.ObjectId, ref: 'CredentialRepository' },
});

module.exports = mongoose.model('Division', DivisionSchema);
