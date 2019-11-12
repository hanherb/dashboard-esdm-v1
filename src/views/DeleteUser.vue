<template lang="pug">
  div.h-100
    d-row.h-50(align-v='center', align-h='center')
      h4 Delete {{user.fullname}} ?
    d-row(align-v='center', align-h='center')
      d-link( to="/users")
        d-button( pill) &larr; Cancel
      d-button( theme="danger" v-on:click="deleteUser()" pill) Delete
</template>

<script>
import gql from '../gql';
import graphqlFunction from '../graphqlFunction';
import address from '../address';
import headers from '../headers';

export default {
  name: 'delete-user',
  data(){
      return{
        user: {}
      }
  },

  created: function()
  {
      this.fetchUser();
  },

  methods: {
      fetchUser() {
        var id = parseInt(window.location.href.split("?id=")[1]);
        this.axios.get(address + ":3000/get-user", headers).then((response) => {
          let query = gql.singleUser;
          let variable = {
            userId: id
          };
          graphqlFunction.graphqlFetchOne(query, variable, (result) => {
            this.user = result.user;
          });
        })
      },

      deleteUser() {
        let postObj = {
          user_id: this.user.user_id
        };
        this.axios.post(address + ':3000/delete-user', postObj, headers)
        .then((response) => {
          let query = gql.deleteUser;
          let variables = {
            userId: this.user.user_id
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            console.log(result)
            alert("Delete User Success");
            this.$router.push('/users');
          });

        });
      }
  }
};
</script>