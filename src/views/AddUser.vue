<template lang="pug">
  d-row.h-100(align-v='center', align-h='center')
    d-form
      .form-group
        label Username
        d-input( type="text" v-model="input.username" placeholder="Username")
      .form-group
        label Full Name
        d-input( type="text" v-model="input.fullname" placeholder="Full Name")
      .form-group
        label Role
        d-form-select( :options="roles" v-model="input.role" placeholder="Role")
      .form-group
        label User Management Authority
        div
          d-checkbox( label="create" v-model="input.authority" value="create") Create
        div
          d-checkbox( label="update" v-model="input.authority" value="update") Update
        div
          d-checkbox( label="delete" v-model="input.authority" value="delete") Delete
        label API Authority
        div( v-for="plugin in plugins")
          d-checkbox( :label="plugin.name" v-model="input.authority" :value="plugin.name") {{plugin.name}}
      .form-group
        label Password
        d-input( type="password" v-model="input.password" placeholder="Password")
      .form-group
        label Confirm Password
        d-input( type="password" v-model="input.confirm_password" placeholder="Confirm Password")
      d-button( type="button" v-on:click="addUser()") Submit
</template>

<script>
import gql from '../gql';
import graphqlFunction from '../graphqlFunction';
import address from '../address';
import headers from '../headers';

export default {
  name: 'add-user',
  data(){
      return{
        input:{
          username: "",
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

  created: function()
  {
      this.fetchRole();
      this.fetchPlugin();
  },

  methods: {
      fetchRole() {
        this.axios.get(address + ":3000/get-role", headers).then((response) => {
          let query = gql.allRole;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            for(let i = 0; i < result.roles.length; i++) {
              let temp = {
                'text': result.roles[i].role_name,
                'value': result.roles[i].role_name
              }
              this.roles.push(temp);
            }
          });
        });
      },

      fetchPlugin() {
        this.axios.get(address + ":3000/get-plugin", headers).then((response) => {
          let query = gql.allPlugin;
          graphqlFunction.graphqlFetchAll(query, (result) => {
            this.plugins = result.plugins;
          });
        });
      },

      addUser() {
        if(this.input.password != this.input.confirm_password) {
          alert("Password tidak sama");
        }
        else {
          let postObj = {
            username: this.input.username, 
            fullname: this.input.fullname,
            role: this.input.role,
            authority: this.input.authority,
            password: this.input.password,
            status: "wait-profile",
          };
          this.axios.post(address + ':3000/create-user', postObj, headers)
          .then((response) => {
            let query = gql.addUser;
            let variables = {
              input: postObj
            }
            graphqlFunction.graphqlMutation(query, variables, (result) => {
              alert("Add User Success");
              this.$router.push('/users');
            });

          });
        }
      }
  }
};
</script>