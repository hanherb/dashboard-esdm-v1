<template>
  <d-container class="vh-100" fluid>
    <main-navbar>
      <d-link class="navbar-brand ml-3 mr-auto" to="/" style="line-height: 25px;">
        <div class="d-table m-auto">
          <img id="main-logo" class="d-inline-block align-top mr-1" style="max-width: 25px;" src="@/assets/images/shards-dashboards-logo.svg" alt="Sikembar">
          <a href="/admin" class="d-md-inline ml-1">SIKEMBAR <span class="title-version">beta v.0.6.5</span></a>
        </div>
      </d-link>
    </main-navbar>
    <slot />
  </d-container>
</template>

<script>
// Main layout components
import MainNavbar from '@/components/layout/MainNavbar/MainNavbar.vue';
import MainFooter from '@/components/layout/MainFooter/MainFooter.vue';

export default {
  name: 'no-navigation',
  components: {
    MainNavbar,
    MainFooter,
  },
  data() {
    return {
    };
  },
};
</script>

<style scoped>
.main-navbar.sticky-top{
  position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1030;
}
</style>
