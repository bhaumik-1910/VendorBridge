const { ApiResponse } = require('../utils/ApiResponse');
const poService = require('../services/purchaseOrderService');

exports.getPOs = async (req, res, next) => {
  try {
    const data = await poService.getPurchaseOrders(req.query, req.user);
    ApiResponse.paginated(res, data.orders, data.pagination);
  } catch (e) { next(e); }
};

exports.getPO = async (req, res, next) => {
  try {
    const order = await poService.getPOById(req.params.id);
    ApiResponse.success(res, { order });
  } catch (e) { next(e); }
};

exports.createPO = async (req, res, next) => {
  try {
    const order = await poService.createPO(req.body, req.user);
    ApiResponse.created(res, { order });
  } catch (e) { next(e); }
};

exports.createFromQuotation = async (req, res, next) => {
  try {
    const order = await poService.createPOFromQuotation(req.params.quotationId, req.user);
    ApiResponse.created(res, { order });
  } catch (e) { next(e); }
};

exports.updatePO = async (req, res, next) => {
  try {
    const order = await poService.updatePO(req.params.id, req.body, req.user);
    ApiResponse.success(res, { order }, 'PO updated');
  } catch (e) { next(e); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const order = await poService.updatePOStatus(req.params.id, req.body.status, req.user);
    ApiResponse.success(res, { order }, 'Status updated');
  } catch (e) { next(e); }
};
