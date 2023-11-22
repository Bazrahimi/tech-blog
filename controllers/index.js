const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./home-routes.js');
const dashboardRoutes = require('./dashboard-routes.js');

// Setup API routes under '/api' prefix
router.use('/api', apiRoutes);

// Setup Home routes at the root '/'
router.use('/', homeRoutes);

// Setup Dashboard routes under '/dashboard' prefix
router.use('/dashboard', dashboardRoutes);

// Catch-all route that sends a 404 status when no routes match
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;
