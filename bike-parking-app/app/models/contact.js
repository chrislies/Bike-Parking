import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    trim: true,
    minLength: [2, "Enter valid name."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    trim: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Invalid email address.",
    ],
  },
  message: {
    type: String,
    required: [true, "Message is required."],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;
