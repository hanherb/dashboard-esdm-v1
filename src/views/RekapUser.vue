<template>
  <d-container fluid class="main-content-container px-4">
    <d-row>
      <d-col md="1" class="form-group">
        <d-button theme="primary" v-on:click="printKeuangan">Print Keuangan</d-button>
      </d-col>
    </d-row>
    <d-row class="mt-4" id="printKeuangan">
      <d-col lg="6" sm="12">
        <up-user-laba-rugi v-if="user.role == 'user' || user.role == 'admin'" />
        <up-user-neraca v-if="user.role == 'user' || user.role == 'admin'" />
      </d-col>

      <d-col lg="6">
        <up-user-rasio-keuangan v-if="user.role == 'user' || user.role == 'admin'" />
      </d-col>
    </d-row>
    <d-row>
      <d-col md="1" class="form-group">
        <d-button theme="primary" v-on:click="printBarang">Print Barang</d-button>
      </d-col>
    </d-row>
    <d-row class="mt-4" id="printBarang">
      <d-col lg="6">
        <ao-neraca />
        <ao-laba-rugi />
      </d-col>
      <d-col lg="6">
        <ao-penerimaan-negara />
        <as-barang />
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

import UserLabaRugi from '@/components/user-profile/UserLabaRugi.vue';
import UserNeraca from '@/components/user-profile/UserNeraca.vue';
import UserRasioKeuangan from '@/components/user-profile/UserRasioKeuangan.vue';
import NeracaChart from '@/components/user-profile/NeracaChart.vue';
import LabaRugiChart from '@/components/user-profile/LabaRugiChart.vue';
import PenerimaanNegaraChart from '@/components/user-profile/PenerimaanNegaraChart.vue';
import ChartBarang from '@/components/belanja-barang/ChartBarang.vue';

export default {
  name: 'rekap-user',
  components: {
    upUserLabaRugi: UserLabaRugi,
    upUserNeraca: UserNeraca,
    upUserRasioKeuangan: UserRasioKeuangan,
    aoNeraca: NeracaChart,
    aoLabaRugi: LabaRugiChart,
    aoPenerimaanNegara: PenerimaanNegaraChart,
    asBarang: ChartBarang,
  },
  data(){
    return{
      user: {},
      session: {},
      output: null,
    }
  },

  created: function() 
  {
    this.fetchUser();
    this.session = this.$session.get('user');
  },

  methods: {
    fetchUser() {
      var id = window.location.href.split("?id=")[1];
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
    printKeuangan() {
      // Pass the element id here
      this.$htmlToPaper('printKeuangan', () => {
        console.log('Printing done or got cancelled!');
      });
    },
    printBarang() {
      // Pass the element id here
      this.$htmlToPaper('printBarang', () => {
        console.log('Printing done or got cancelled!');
      });
    },
  }
};
</script>
