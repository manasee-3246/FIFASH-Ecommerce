import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    subtitle: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    bannerImage: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('Banner', bannerSchema);