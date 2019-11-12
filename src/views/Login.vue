<template>
  <div class="main-content-container container-fluid h-100 px-4">
    <d-row no-gutters class="h-100">
      <d-col lg="3" md="5" class="auth-form mx-auto my-auto">
        <d-card>
          <d-card-body>
            <!-- Logo -->
            <!-- <img class="auth-form__logo d-table mx-auto mb-3" src="@/assets/images/logo.gif" alt="ESDM Dashboards - Login"> -->

            <!-- Title -->
            <h5 class="auth-form__title text-center mb-4">Access Your Account</h5>

            <!-- Form Fields -->
            <div class="form-group">
              <label for="exampleInputUsername1">Username</label>
              <input class="form-control" type="username" v-model="input.username" @keyup.enter="login" id="exampleInputUsername1" placeholder="Enter username" />
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input class="form-control" type="password" v-model="input.password" @keyup.enter="login" id="exampleInputPassword1" placeholder="Password" />
            </div>
            <d-button pill v-on:click="login" class="btn-accent d-table mx-auto">Access Account</d-button>
          </d-card-body>

          <!-- Social Icons -->
        </d-card>

        <!-- Meta Details -->
        <div class="auth-form__meta d-flex mt-4">
          <d-link tag="a" to="forgot-password">Forgot your password?</d-link>
          <d-link tag="a" to="register" class="ml-auto">Create a new account?</d-link>
        </div>
      </d-col>
    </d-row>
  </div>
</template>
<script>
import address from '@/address';
export default {
  name: 'login',
  props: {
    /**
       * The component's title.
       */
    title: {
      type: String,
      default: 'Application',
    },
  },
  data(){
      return {
        input: {
          username: "",
          password: ""
        }
      }
  },

  methods: {
    login() {
      if(this.input.username != "" && this.input.password != "") {
        this.axios.post(address + ':3000/login-user', {
          username: this.input.username, 
          password: this.input.password
        })
        .then((response) => {
          console.log(response.data.response);
          if(response.data.token) {
            // alert("Login Success");
            if(response.data.response.status != 'wait-profile') {
              if(response.data.response.role == "admin") {
                this.$router.push('/analytics');
              }
              else {
                this.$router.push('/user-profile?id=' + response.data.response.user_id);
              }
            }
            else {
              if(response.data.response.role != "supplier") {
                this.$router.push('/edit-user-profile');
              }
              else {
                this.$router.push('/edit-supplier-profile');
              }
            }
            this.$session.start();
            this.$session.set('user', response.data.response);
            document.cookie = "token=" + response.data.token;
            document.cookie = "user_session=" + this.$session.get('user').user_id;
            document.cookie = "user_authority=" + this.$session.get('user').authority;
            document.cookie = "user_status=" + this.$session.get('user').status;
            localStorage.setItem('user_role', this.$session.get('user').role);
            localStorage.setItem('user_authority', this.$session.get('user').authority);
            localStorage.setItem('user_status', this.$session.get('user').status);
          }
          else {
            alert("Incorrect combination of username and password");
          }
        });
      }
      else {
        alert("Email and password cannot be empty");
      }
    }
  }
};
</script>

<style scoped>
  .main-content-container {
    padding-top: 6rem;
  }
</style>
