import CustomRequest from '../models/CustomRequest.js';

export const getCustomRequests = async (req, res, next) => {
  try {
    const requests = await CustomRequest.find({}).sort('-createdAt');
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

export const createCustomRequest = async (req, res, next) => {
  try {
    const request = await CustomRequest.create(req.body);
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

export const updateCustomRequestStatus = async (req, res, next) => {
  try {
    const request = await CustomRequest.findById(req.params.id);

    if (request) {
      request.status = req.body.status || request.status;
      const updatedRequest = await request.save();
      res.json(updatedRequest);
    } else {
      res.status(404);
      next(new Error('Custom request not found'));
    }
  } catch (error) {
    next(error);
  }
};

export const deleteCustomRequest = async (req, res, next) => {
  try {
    const request = await CustomRequest.findById(req.params.id);

    if (request) {
      await request.deleteOne();
      res.json({ success: true, message: 'Custom request deleted successfully' });
    } else {
      res.status(404);
      next(new Error('Custom request not found'));
    }
  } catch (error) {
    next(error);
  }
};
