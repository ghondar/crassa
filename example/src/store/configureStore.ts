const configureStore = process.env.NODE_ENV === 'production' ? require('./configureStore.prod') : require('./configureStore.dev')

export const history = configureStore.history
export default configureStore.default
