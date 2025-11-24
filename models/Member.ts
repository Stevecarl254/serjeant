import mongoose, { Schema, model, models } from 'mongoose';

const MemberSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    phoneNumber: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active',
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
});

const Member = models.Member || model('Member', MemberSchema);

export default Member;
