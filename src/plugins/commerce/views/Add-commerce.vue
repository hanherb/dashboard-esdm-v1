<template>
  <d-row>
    <d-col lg="5" class="mb-4 mx-auto my-auto">
      <d-card class="card-small">
        <d-card-header class="border-bottom">
          <h6 class="m-0">Add Item</h6>
        </d-card-header>

        <d-list-group flush>
          <d-list-group-item class="p-3">
            <d-row>
              <d-col>
                <d-form-row>
                  <d-col md="12" class="form-group">
                    <label>Item Name</label>
                    <d-input v-model="input.name" type="text" placeholder="Item Name" />
                  </d-col>
                </d-form-row>

                <d-form-row>
                  <d-col md="12" class="form-group">
                    <label>Category</label>
                    <d-input-group seamless>
                      <d-form-select :options="select_category" v-model="input.category">
                      </d-form-select>
                    </d-input-group>
                  </d-col>
                </d-form-row>

                <d-form-row>
                  <d-col md="12" class="form-group">
                    <label>Price</label>
                    <d-input v-model="input.price" type="number" placeholder="Price" />
                  </d-col>
                </d-form-row>

                <d-form-row>
                  <d-col md="12" class="form-group">
                    <label>Qty</label>
                    <d-input v-model="input.qty" type="number" placeholder="Qty" />
                  </d-col>
                </d-form-row>

                <d-form-row>
                  <d-col md="12" class="form-group">
                    <label>TKDN</label>
                    <d-input v-model="input.tkdn" type="number" placeholder="TKDN" />
                  </d-col>
                </d-form-row>

                <d-form-row>
                  <d-col md="12" class="form-group">
                    <label>Description</label>
                    <textarea v-model="input.description" placeholder="Description" rows="10" wrap="soft" class="form-control form-control-lg" />
                  </d-col>
                </d-form-row>

                <d-form-row>
                  <d-col md="12" class="form-group">
                    <label>Goods Picture</label>
                    <input @change="onFileChange" type="file" id="inputPicture" class="form-control" />
                    <span v-if="picture_upload.name" size="sm" class="d-table mx-auto mt-4"><i class="material-icons">&#xE2C3;</i> Image Uploaded</span>
                  </d-col>
                </d-form-row>
                <d-button v-on:click="submitFile()">Submit</d-button>
              </d-col>
            </d-row>
          </d-list-group-item>
        </d-list-group>
      </d-card>
    </d-col>
  </d-row>
</template>

<script>
import gql from '@/gql';
import graphqlFunction from '@/graphqlFunction';
import basicFunction from '@/basicFunction';
import address from '@/address';
import headers from '@/headers';

import kategoriBarang from '@/data/kategori-barang';

export default {
  name: 'add-commerce',
  data(){
      return{
        input:{
          name: "",
          price: "",
          qty: "",
          tkdn: "",
          description: "",
          image: "",
          category: "",
        },
        select_category: kategoriBarang,
        picture_upload: [],
      }
  },

  methods: {
      addCommerce() {
        let user = this.$session.get('user').fullname;
        let user_id = this.$session.get('user')._id;
        let postObj = {
          name: this.input.name,
          price: parseInt(this.input.price),
          qty: parseInt(this.input.qty),
          tkdn: parseInt(this.input.qty),
          description: this.input.description,
          category: this.input.category,
          image: this.input.image,
          user: user,
          user_id: user_id,
        };
        this.axios.post(address + ':3000/add-commerce', postObj, headers)
        .then((response) => {
          postObj._id = response.data.insertedIds[0];
          let query = gql.addCommerce;
          let variables = {
            input: postObj
          }
          graphqlFunction.graphqlMutation(query, variables, (result) => {
            alert("Add Item Success");
            this.$router.push('/commerce');
          });
        });
      },
      onFileChange(event) {
        this.picture_upload = event.target.files[0];
      },
      submitFile() {
        if(!this.input.name || 
          !this.input.qty ||
          !this.input.description ||
          !this.input.category ||
          this.picture_upload.length == 0) {
          alert("Please fill the provided form");
        }
        else {
          let formData = new FormData();
          if(this.picture_upload.length != 0) {
            formData.append('goods_picture', this.picture_upload, 'goods_' + this.$session.get('user')._id + '_' + this.input.name);
          }

          this.axios.post(address + ':3000/post-goods-picture', formData, headers)
          .then((response) => {
            if(response.data != 'No Goods Picture Uploaded') {
              this.input.image = response.data.originalname;
            }
            else {
              alert("No picture uploaded");
            }
            this.addCommerce();
          });
        }
      },
  }
};
</script>