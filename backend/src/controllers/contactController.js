const { ApiResponse } = require('../utils/ApiResponse');
const logActivity = require('../helpers/activityLogger');

exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    await logActivity({
      user: { name },
      action: 'Contact form submission',
      target: `${email}: ${subject || 'General inquiry'}`,
      type: 'system',
      metadata: { message, email, name },
    });
    ApiResponse.success(res, null, 'Thank you! We will get back to you shortly.');
  } catch (e) { next(e); }
};
