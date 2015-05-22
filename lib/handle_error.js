
function handle_error(res, err) {
    res.status(404)
	.render('error', {
            message: err.message,
            error: err
    });
}

module.exports = handle_error;
