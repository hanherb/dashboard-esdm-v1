<template lang="pug">
  d-row.h-100(align-v='center', align-h='center')
    d-form
      .form-group
        label Username
        d-input( type="text" v-model="input.user.username" placeholder="Username")
      .form-group
        label Full Name
        d-input( type="text" v-model="input.user.fullname" placeholder="Full Name")
      .form-group
        label Role
        d-form-select( :options="roles" v-model="input.user.role" placeholder="Role")
      d-button( type="button" v-on:click="updateUser()") Submit
</template>

<script>
import gql from '../gql';
import graphqlFunction from '../graphqlFunction';
import address from '../address';
import headers from '../headers';

export default {
  name: 'update-user',
  data(){
      return{
        input:{
          user: {},
        },
        id: null,
        user: {},
        roles: [],
      }
  },

  created: function()
  {
      this.fetchUser();
      this.fetchRole();
      this.fetchPlugin();
  },

  methods: {
      fetchUser() {
        var id = parseInt(window.location.href.split("?id=")[1]);
        this.id = id;
        this.axios.get(address + ":3000/get-user", headers).then((response) => {
          let query = gql.singleUser;
          let variable = {
            userId: id
          };
          graphqlFunction.graphqlFetchOne(query, variable, (result) => {
            this.input.user = result.user;
          });
        })
      },
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

      updateUser() {
        let postObj = {
          user_id: this.id,
          username: this.input.user.username, 
          fullname: this.input.user.fullname,
          password: this.input.user.password,
          role: this.input.user.role,
        };
        this.axios.post(address + ':3000/update-user', postObj, headers)
        .then((response) => {
          let query = gql.updateUser;
          let variables = {
            userId: this.id,
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            alert("Update User Success");
            this.$router.push('/users');
          });

        });
      }
  }
};
</script>