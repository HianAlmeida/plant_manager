const mongoose = require('mongoose');

const DeviceSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter user name"],
            unique: false
        },
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
            unique: false
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Device = mongoose.model("Device", DeviceSchema);

module.exports = Device;