import mongoose, { Schema, model, models } from 'mongoose';

const EventSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the event'],
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    date: {
        type: Date,
        required: [true, 'Please provide a date for the event'],
    },
    location: {
        type: String,
        required: [true, 'Please provide a location'],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Event = models.Event || model('Event', EventSchema);

export default Event;
