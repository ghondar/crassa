export default process.env.NODE_ENV === 'production' || process.env.PROD ? require('./Root.prod').default : require('./Root.dev').default;
