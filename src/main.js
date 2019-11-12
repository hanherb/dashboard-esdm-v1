/* eslint-disable */
import Vue from 'vue';
import ShardsVue from 'shards-vue';
import VueAnalytics from 'vue-analytics';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueSession from 'vue-session';
import VueHtmlToPaper from 'vue-html-to-paper';

// Styles
import 'bootstrap/dist/css/bootstrap.css';
import '@/assets/shards-dashboard-pro/shards-dashboards.scss';
import '@/assets/scss/date-range.scss';

// Core
import App from './App.vue';
import router from './router';

// Layouts
import Default from '@/layouts/Default.vue';
import NonAdmin from '@/layouts/NonAdmin.vue';
import NoNavigation from '@/layouts/NoNavigation.vue';
import HeaderNavigation from '@/layouts/HeaderNavigation.vue';
import IconSidebar from '@/layouts/IconSidebar.vue';

const isProd = process.env.NODE_ENV === 'production';

const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css'
  ]
}

ShardsVue.install(Vue);

Vue.component('default-layout', Default);
Vue.component('non-admin-layout',NonAdmin);
Vue.component('no-navigation-layout', NoNavigation);
Vue.component('header-navigation-layout', HeaderNavigation);
Vue.component('icon-sidebar-layout', IconSidebar);

Vue.config.productionTip = false;
Vue.prototype.$eventHub = new Vue();

Vue.use(VueAxios, axios);
Vue.use(VueSession);
Vue.use(VueHtmlToPaper, options);

// Analytics
Vue.use(VueAnalytics, {
  id: isProd ? 'UA-115105611-1' : 'UA-115105611-2',
  router
});

router.beforeEach((to, from, next) => {
    if(localStorage.getItem('user_role')) {
        var user_role = localStorage.getItem('user_role');
    }
    if(localStorage.getItem('user_authority')) {
        var user_authority = localStorage.getItem('user_authority').split(',');
    }
    if(localStorage.getItem('user_status')) {
        var user_status = localStorage.getItem('user_status').split(',');
    }
    if(user_status == 'wait-profile') {
        if(user_role != "supplier") {
            if(to.path != '/edit-user-profile') {
                next('/edit-user-profile');
            }
            else {
                next();
            }
        }
        else {
            if(to.path != '/edit-supplier-profile') {
                next('/edit-supplier-profile');
            }
            else {
                next();
            }
        }
    }
    else {
        if(to.path == '/add-user') {
            if(user_role != 'admin') {
                next({
                    path: '/not-authenticated',
                })
            }
            else {
                next();
            }
        }
        else if(to.path == '/update-user') {
            if(user_role != 'admin') {
                next({
                    path: '/not-authenticated',
                })
            }
            else {
                next();
            }
        }
        else if(to.path == '/delete-user') {
            if(user_role != 'admin') {
                next({
                    path: '/not-authenticated',
                })
            }
            else {
                next();
            }
        }
        else {
            next();
        }
    }
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
