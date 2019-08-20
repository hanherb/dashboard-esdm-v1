<template>
  <div>
    <d-row>
      <d-col md="2" class="form-group">
        <d-form-select v-model="selected_1" :options="select_kategori" @change="filterKategori($event)"></d-form-select>
      </d-col>
      <d-col md="2" class="form-group">
        <d-button theme="primary" v-on:click="applyFilter"> Apply Filter</d-button>
      </d-col>
    </d-row>
    <d-row>
      <d-col md="6" lg="3" class="mb-4" v-for="commerce in commerces">
        <d-card style="max-width: 300px">
          <d-card-header style="background-color: #efeeee">{{commerce.category}}</d-card-header>
          <d-card-img :src="require('@/assets/images/uploads/' + commerce.image + '.png')"/>
          <d-card-body :title="commerce.name">
              <p>{{commerce.description}}</p>
              <p>By: 
                <d-link :to="'/user-profile?id=' + commerce.user_id">{{commerce.user}}</d-link>
              </p>
          </d-card-body>
          <d-card-footer style="background-color: #efeeee">$ {{commerce.price}}</d-card-footer>
        </d-card>
      </d-col>
    </d-row>
  </div>
</template>

<script>
import gql from '@/gql';
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';
import headers from '@/headers';

export default {
  name: 'list-commerce',
  data(){
      return{
          input: {
            qty: ""
          },
          filter: {
            kategori: "All"
          },
          commerces: [],
          carts: [],
          totalShoppingPrice: 0,
          select_kategori: [
            {value: null, text: 'Filter Kategori..', disabled: true },
            {value: 'All', text: 'Show All'},
            {value: 'HEAVY EQUIPMENT', text: 'A. HEAVY EQUIPMENT'},
            {value: 'LAND TRANSPORT EQUIPMENT', text: 'B. LAND TRANSPORT EQUIPMENT'},
            {value: 'WATER TRANSPORT EQUIPMENT', text: 'C. WATER TRANSPORT EQUIPMENT'},
            {value: 'AIR TRANSPORT EQUIPMENT', text: 'D. AIR TRANSPORT EQUIPMENT'},
            {value: 'COMMUNICATION', text: 'E. COMMUNICATION'},
            {value: 'LAND SURVEY & RECOINASSANCE', text: 'F. LAND SURVEY & RECOINASSANCE'},
            {value: 'DRILLING EQUIPMENT', text: 'G. DRILLING EQUIPMENT'},
            {value: 'SAMPLING & LAB', text: 'H. SAMPLING & LAB'},
            {value: 'REPAIR & MAINTENANCE', text: 'I. REPAIR & MAINTENANCE'},
            {value: 'BUILDING MATERIALS', text: 'J. BUILDING MATERIALS'},
            {value: 'UTILITIES, FURNITURE & APPLIANCES', text: 'K. UTILITIES, FURNITURE & APPLIANCES'},
            {value: 'CONSUMABLES: FUEL', text: 'L. CONSUMABLES: FUEL'},
            {value: 'CONSUMABLES: FOOD', text: 'M. CONSUMABLES: FOOD'},
            {value: 'MISCELLANEOUS', text: 'N. MISCELLANEOUS'},
            {value: 'MEDICAL: HEALTHY & SAFETY', text: 'O. MEDICAL: HEALTHY & SAFETY'},
            {value: 'RECREATION FACILITY', text: 'P. RECREATION FACILITY'},
            {value: 'POWER STATION', text: 'Q. POWER STATION'},
            {value: 'PROCESSING PLANT', text: 'R. PROCESSING PLANT'},
            {value: 'SCHOOL & TRAINING', text: 'S. SCHOOL & TRAINING'},
            {value: 'ENVIRONMENTAL', text: 'T. ENVIRONMENTAL'}
          ],
          selected_1: null,
      }
  },

  created: function()
  {
      this.fetchItems(this.filter.kategori);
  },

  methods: {
    fetchItems(kategori) {
      this.axios.get(address + ":3000/get-commerce", headers).then((response) => {
        let query = gql.allCommerce;
        graphqlFunction.graphqlFetchAll(query, (result) => {
          for(var i = 0; i < result.commerces.length; i++) {
            if(kategori == result.commerces[i].category || kategori == 'All') {
              result.commerces[i].price = basicFunction.numberWithCommas(result.commerces[i].price);
              this.commerces.push(result.commerces[i]);
            }
          }
        });
      });
    },
    filterKategori(kategori) {
      this.filter.kategori = kategori;
    },
    applyFilter() {
      this.commerces = [];
      this.fetchItems(this.filter.kategori);
    },
  }
};
</script>

<style scoped>
  img {
    width: 300px;
    height: 250px;
  }
</style>