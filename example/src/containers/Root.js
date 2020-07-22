module.exports = process.env.NODE_ENV === 'production' || process.env.PROD ? require('./Root.prod') : require('./Root.dev')
