import { createStore, Store } from 'vuex';

import auth from './auth';
import notifications from './notifications';
import projects from './projects';

import { state, RootStateI } from './state';
import { mutations } from './mutations';

const store: Store<RootStateI> = createStore({
  state,
  getters: {
  },
  mutations,
  actions: {
  },
  modules: {
  },
});

store.registerModule('auth', auth);
store.registerModule('notifications', notifications);
store.registerModule('projects', projects);

export default store;
