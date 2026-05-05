import mongoose from 'mongoose';

const reportSchema = mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reportedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);

export default Report;
