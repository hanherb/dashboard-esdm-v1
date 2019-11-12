<template>
  <d-container fluid class="main-content-container px-4">
    <d-row class="mt-4">
      <d-col lg="4" sm="12">
        <up-user-details />
        <up-user-activity />
      </d-col>

      <d-col lg="8">
        <d-alert show v-if="session.role == 'user'">Download Format Spreadsheet - <a class="alert-link" href="/admin/downloads/FormatCSV.rar">Click Here</a></d-alert> 
        <!-- <up-user-laba-rugi v-if="user.role == 'user' || user.role == 'admin'" /> -->
        <up-user-neraca v-if="user.role == 'user' || user.role == 'admin'" />
        <!-- <up-user-rasio-keuangan v-if="user.role == 'user' || user.role == 'admin'" />
        <up-user-goods v-if="user.role == 'supplier' || user.role == 'admin'" /> -->
        <ao-neraca v-if="user.role == 'user' || user.role == 'admin'" />
        <!-- <ao-laba-rugi v-if="user.role == 'user' || user.role == 'admin'" />
        <ao-penerimaan-negara v-if="user.role == 'user' || user.role == 'admin'" /> -->
      </d-col>
    </d-row>
  </d-container>
</template>

<script>
import gql from '@/gql';
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';
import headers from '@/headers';

import UserDetails from '@/components/user-profile/UserDetails.vue';
import UserActivity from '@/components/user-profile/UserActivity.vue';
import UserLabaRugi from '@/components/user-profile/UserLabaRugi.vue';
import UserNeraca from '@/components/user-profile/UserNeraca.vue';
import UserRasioKeuangan from '@/components/user-profile/UserRasioKeuangan.vue';
import UserGoods from '@/components/user-profile/UserGoods.vue';
import NeracaChart from '@/components/user-profile/NeracaChart.vue';
import LabaRugiChart from '@/components/user-profile/LabaRugiChart.vue';
import PenerimaanNegaraChart from '@/components/user-profile/PenerimaanNegaraChart.vue';

export default {
  name: 'user-profile',
  components: {
    upUserDetails: UserDetails,
    upUserActivity: UserActivity,
    upUserLabaRugi: UserLabaRugi,
    upUserNeraca: UserNeraca,
    upUserRasioKeuangan: UserRasioKeuangan,
    upUserGoods: UserGoods,
    aoNeraca: NeracaChart,
    aoLabaRugi: LabaRugiChart,
    aoPenerimaanNegara: PenerimaanNegaraChart,
  },
  data(){
    return{
      user: {},
      session: {},
    }
  },

  created: function() 
  {
    this.fetchUser();
    this.session = this.$session.get('user');
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
  }
};
</script>
