import Vue from 'vue';
import Router from 'vue-router';

import OnlineStore from './views/OnlineStore.vue';
import HeaderNavigation from './views/HeaderNavigation.vue';
import IconSidebarNav from './views/IconSidebarNav.vue';
import PersonalBlog from './views/PersonalBlog.vue';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import ForgotPassword from './views/ForgotPassword.vue';
import ChangePassword from './views/ChangePassword.vue';
import FileManagerList from './views/FileManagerList.vue';
import FileManagerCards from './views/FileManagerCards.vue';
import TransactionHistory from './views/TransactionHistory.vue';
import AddNewPost from './views/AddNewPost.vue';
import Errors from './views/Errors.vue';
import ComponentsOverview from './views/ComponentsOverview.vue';
import Tables from './views/Tables.vue';
import BlogPosts from './views/BlogPosts.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: '/',
      name: '/home',
      meta: { layout: 'no-navigation' },
      component: Home,
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('./views/Analytics.vue'),
    },
    {
      path: '/ecommerce',
      name: 'ecommerce',
      component: OnlineStore,
    },
    {
      path: '/blog-overview',
      name: 'blog-overview',
      component: PersonalBlog,
    },
    {
      path: '/user-profile',
      name: 'user-profile',
      component: () => import('./views/UserProfile.vue'),
    },
    {
      path: '/edit-user-profile',
      name: 'edit-user-profile',
      component: () => import('./views/EditUserProfile.vue'),
    },
    {
      path: '/edit-supplier-profile',
      name: 'edit-supplier-profile',
      component: () => import('./views/EditSupplierProfile.vue'),
    },
    {
      path: '/login',
      name: 'login',
      meta: { layout: 'no-navigation' },
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      meta: { layout: 'no-navigation' },
      component: Register,
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      meta: { layout: 'icon-sidebar' },
      component: ForgotPassword,
    },
    {
      path: '/change-password',
      name: 'change-password',
      meta: { layout: 'icon-sidebar' },
      component: ChangePassword,
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('./views/Users.vue'),
    },
    {
      path: '/add-user',
      name: 'add-user',
      component: () => import('./views/AddUser.vue'),
    },
    {
      path: '/update-user',
      name: 'update-user',
      component: () => import('./views/UpdateUser.vue'),
    },
    {
      path: '/delete-user',
      name: 'delete-user',
      component: () => import('./views/DeleteUser.vue'),
    },
    {
      path: '/xls-keuangan-op',
      name: 'xls-keuangan-op',
      component: () => import('./views/XlsKeuanganOP.vue'),
    },
    {
      path: '/csv-belanja-barang',
      name: 'csv-belanja-barang',
      component: () => import('./views/CsvBelanjaBarang.vue'),
    },
    {
      path: '/rekap-belanja-barang',
      name: 'rekap-belanja-barang',
      component: () => import('./views/RekapBelanjaBarang.vue'),
    },
    {
      path: '/rekap-belanja-barang-total',
      name: 'rekap-belanja-barang-total',
      component: () => import('./views/RekapBelanjaBarangTotal.vue'),
    },
    {
      path: '/rekap-belanja-barang-perusahaan',
      name: 'rekap-belanja-barang-perusahaan',
      component: () => import('./views/RekapBelanjaBarangPerusahaan.vue'),
    },
    {
      path: '/rekap-arus-kas',
      name: 'rekap-arus-kas',
      component: () => import('./views/RekapArusKas.vue'),
    },
    {
      path: '/rekap-anggaran-belanja',
      name: 'rekap-anggaran-belanja',
      component: () => import('./views/RekapAnggaranBelanja.vue'),
    },
    {
      path: '/rekap-asumsi-keuangan',
      name: 'rekap-asumsi-keuangan',
      component: () => import('./views/RekapAsumsiKeuangan.vue'),
    },
    {
      path: '/rekap-harga-pokok',
      name: 'rekap-harga-pokok',
      component: () => import('./views/RekapHargaPokok.vue'),
    },
    {
      path: '/rekap-investasi',
      name: 'rekap-investasi',
      component: () => import('./views/RekapInvestasi.vue'),
    },
    {
      path: '/rekap-keuangan-lainnya',
      name: 'rekap-keuangan-lainnya',
      component: () => import('./views/RekapKeuanganLainnya.vue'),
    },
    {
      path: '/rekap-laba-rugi',
      name: 'rekap-laba-rugi',
      component: () => import('./views/RekapLabaRugi.vue'),
    },
    {
      path: '/rekap-neraca',
      name: 'rekap-neraca',
      component: () => import('./views/RekapNeraca.vue'),
    },
    {
      path: '/rekap-penerimaan-negara',
      name: 'rekap-penerimaan-negara',
      component: () => import('./views/RekapPenerimaanNegara.vue'),
    },
    {
      path: '/rekap-sumber-pembiayaan',
      name: 'rekap-sumber-pembiayaan',
      component: () => import('./views/RekapSumberPembiayaan.vue'),
    },
    {
      path: '/rekap-user',
      name: 'rekap-user',
      component: () => import('./views/RekapUser.vue'),
    },
    {
      path: '/verifikasi-barang',
      name: 'verifikasi-barang',
      component: () => import('./views/VerifikasiBarang.vue'),
    },
    {
      path: '/commerce',
      name: 'commerce',
      component: () => import('./plugins/commerce/views/Commerce.vue'),
    },
    {
      path: '/list-commerce',
      name: 'list-commerce',
      component: () => import('./plugins/commerce/views/List-commerce.vue'),
    },
    {
      path: '/add-commerce',
      name: 'add-commerce',
      component: () => import('./plugins/commerce/views/Add-commerce.vue'),
    },
    {
      path: '/update-commerce',
      name: 'update-commerce',
      component: () => import('./plugins/commerce/views/Update-commerce.vue'),
    },
    {
      path: '/delete-commerce',
      name: 'delete-commerce',
      component: () => import('./plugins/commerce/views/Delete-commerce.vue'),
    },
    {
      path: '/file-manager-list',
      name: 'file-manager-list',
      component: FileManagerList,
    },
    {
      path: '/file-manager-cards',
      name: 'file-manager-cards',
      component: FileManagerCards,
    },
    {
      path: '/transaction-history',
      name: 'transaction-history',
      component: TransactionHistory,
    },
    {
      path: '/company-list',
      name: 'company-list',
      component: () => import('./views/CompanyList.vue'),
    },
    {
      path: '/supplier-list',
      name: 'supplier-list',
      component: () => import('./views/SupplierList.vue'),
    },
    {
      path: '/add-new-post',
      name: 'add-new-post',
      component: AddNewPost,
    },
    {
      path: '/errors',
      name: 'errors',
      component: Errors,
    },
    {
      path: '/components-overview',
      name: 'components-overview',
      component: ComponentsOverview,
    },
    {
      path: '/tables',
      name: 'tables',
      component: Tables,
    },
    {
      path: '/blog-posts',
      name: 'blog-posts',
      component: BlogPosts,
    },
    {
      path: '/header-navigation',
      name: 'header-navigation',
      meta: { layout: 'header-navigation' },
      component: HeaderNavigation,
    },
    {
      path: '/icon-sidebar-nav',
      name: 'icon-sidebar-nav',
      meta: { layout: 'icon-sidebar' },
      component: IconSidebarNav,
    }, 
    {
      path: '/not-admin',
      name: 'not-admin',
      meta: { layout: 'non-admin' },
      component: () => import('./views/NotAdmin.vue'),
    },
    {
      path: '/not-authenticated',
      name: 'not-authenticated',
      component: () => import('./views/NotAuthenticated.vue'),
    },
    {
      path: '/xls-test',
      name: 'xls-test',
      component: () => import('./views/XlsTest.vue'),
    },
    {
      path: '*',
      redirect: '/errors',
    },
  ],
});
