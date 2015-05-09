
function handle_error(res, err) {
    res.status(404).render('error');
}

module.exports = handle_error;
