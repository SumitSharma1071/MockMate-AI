let successhandler = (req, res, next) =>{
     if (res.locals.success && res.locals.success.length > 0) {
    return res.status(200).json({
      success: true,
      message: res.locals.success[0],
      data: res.locals.data || {}
    });
  }
  next();
};

module.exports = successhandler;