
function handle_error(res) {
    res.status(404).render('error');
}

module.exports = handle_error;
