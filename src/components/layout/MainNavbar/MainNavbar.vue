<template>
  <div :class="['main-navbar', 'bg-dark', stickyTop ? 'sticky-top' : '']">
    <d-navbar type="dark" class="align-items-stretch justify-content-end flex-reverse-row flex-md-nowrap p-0">
      <slot/>
      <!-- <navbar-search /> -->
      <navbar-nav />
      <navbar-toggle />
    </d-navbar>
  </div>
</template>

<script>
//import NavbarSearch from './NavbarSearch.vue';
import NavbarNav from './NavbarNav.vue';
import NavbarToggle from './NavbarToggle.vue';

export default {
  components: {
    //NavbarSearch,
    NavbarNav,
    NavbarToggle,
  },
  props: {
    /**
       * Whether the main navbar should be sticky, or not.
       */
    stickyTop: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss">
.main-navbar {
  border-bottom: solid 2px #caae11; 

  .dropdown-menu {
    display: block;
  }
}
</style>
