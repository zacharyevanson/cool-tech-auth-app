const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CredentialSchema = new Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const CredentialRepositorySchema = new Schema({
  division: { type: Schema.Types.ObjectId, ref: 'Division' },
  credentials: [CredentialSchema],
});

module.exports = mongoose.model('CredentialRepository', CredentialRepositorySchema);
