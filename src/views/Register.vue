<template>
  <div class="main-content-container container-fluid h-100 px-4">
    <d-row no-gutters class="h-100">
      <d-col lg="3" md="5" class="auth-form mx-auto my-auto">
        <d-card>
          <d-card-body>
            <!-- Logo -->
            <!-- <img class="auth-form__logo d-table mx-auto mb-3" src="@/assets/images/logo.gif" alt="ESDM Dashboards - Register"> -->

            <!-- Title -->
            <h5 class="auth-form__title text-center mb-4">Create New Account</h5>

            <!-- Form Fields -->
            <div class="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input class="form-control" type="email" v-model='input.email' id="exampleInputEmail1" placeholder="Enter email" />
            </div>
            <div class="form-group">
              <label for="exampleInputFullname1">Fullname</label>
              <input class="form-control" type="text" v-model='input.fullname' id="exampleInputFullname1" placeholder="Enter fullname" />
            </div>
            <div class="form-group">
              <label for='Role'> Role</label>
              <d-form-radio id="f1_Role" v-model='input.role' value='admin'>Admin</d-form-radio>
              <d-form-radio id="f2_Role" v-model='input.role' value='user'>User</d-form-radio>
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input class="form-control" type="password" v-model='input.password' id="exampleInputPassword1" placeholder="Password" />
            </div>
            <div class="form-group">
              <label for="exampleInputPassword2">Repeat Password</label>
              <input class="form-control" type="password" v-model='input.confirm_password' id="exampleInputPassword2" placeholder="Repeat Password" />
            </div>
            <d-button pill v-on:click="register" class="btn-accent d-table mx-auto">Create Account</d-button>
          </d-card-body>
        </d-card>

        <!-- Meta -->
        <div class="auth-form__meta d-flex mt-4">
          <d-link tag="a" to="forgot-password">Forgot your password?</d-link>
          <d-link tag="a" to="register" class="ml-auto">Sign In?</d-link>
        </div>
      </d-col>
    </d-row>
  </div>
</template>

<script>
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';

export default {
  name: 'register',
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
      return{
        input:{
          email: "",
          fullname: "",
          role: "",
          authority: [],
          password: "",
          confirm_password: ""
        },
        roles: [],
        plugins: []
      }
  },

  methods: {
    register() {
      if(this.input.email != "" && this.input.fullname != "" && this.input.password != "" && this.input.confirm_password != "") {
        if(this.input.password == this.input.confirm_password) {
          let postObj = {
            email: this.input.email, 
            fullname: this.input.fullname,
            role: this.input.role,
            authority: this.input.authority,
            password: this.input.password,
            status: "wait-profile",
          };
          this.axios.post(address + ':3000/register-user', postObj)
          .then((response) => {
            postObj._id = response.data.insertedIds[0];
            let query = `mutation createSingleUser($input:PersonInput) {
                createUser(input: $input) {
                    fullname
                }
            }`;
            let variables = {
              input: postObj
            }
            graphqlFunction.graphqlMutation(query, variables, (result) => {
              alert("Add User Success");
              this.$router.push('/');
            });
          });
        }
        else {
          alert("Password didn't match");
        }
      }
      else {
        alert("Field cannot be empty");
      }
    }
  }
}
</script>

<style scoped>
  .main-content-container {
    padding-top: 6rem;
  }
</style>