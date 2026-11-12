import { get, route } from 'remix/routes'

export const routes = route({
  assets: get('/assets/*path'),
  home: '/',
  list: '/list',
  detail: '/detail',
  shortDetail: '/short-detail',
})
