import asyncHandler from '../middleware/asyncHandler.js';
import Report from '../models/reportModel.js';

// @desc    Create new report
// @route   POST /api/reports
// @access  Private

const createReport = asyncHandler(async (req, res) => {
  const { reportedUserId, reportedProductId, reason } = req.body;

  if (!reason) {
    res.status(400);
    throw new Error('No reason provided');
  }

  const report = new Report({
    reporter: req.user._id,
    reportedUser: reportedUserId || null,
    reportedProduct: reportedProductId || null,
    reason,
  });

  const createdReport = await report.save();
  res.status(201).json(createdReport);
});

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({})
    .populate('reporter', 'name email')
    .populate('reportedUser', 'name email isSuspended')
    .populate('reportedProduct', 'title');

  res.json(reports);
});

// @desc    Resolve report
// @route   PUT /api/reports/:id/resolve
// @access  Private/Admin
const resolveReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (report) {
    report.status = 'resolved';
    const updatedReport = await report.save();
    res.json(updatedReport);
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
});

// @desc    Delete report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
const deleteReport = asyncHandler(async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (report) {
    await Report.deleteOne({ _id: report._id });
    res.json({ message: 'Report removed' });
  } else {
    res.status(404);
    throw new Error('Report not found');
  }
});

export { createReport, getReports, resolveReport, deleteReport };
