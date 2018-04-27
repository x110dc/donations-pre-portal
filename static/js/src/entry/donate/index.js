import Vue from 'vue';
import Vuex from 'vuex';

import App from '../../App.vue';
import FormModule from '../../store/modules/form';
import { createRouter, bindRouterEvents } from './router';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    baseForm: FormModule,
  },
});
const router = createRouter();
const routeHandler = new Vue({ ...App, router });

bindRouterEvents(router, routeHandler, store);
