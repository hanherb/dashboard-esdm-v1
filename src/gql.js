let query = {
	allUser: `query getAllUser {
      users {
        user_id
        username
        fullname
        password
        company_type
        role
      }
    }`,

	singleUser: `query getSingleUser($userId: Int!) {
      user(user_id: $userId) {
        user_id
        username
        fullname
        password
        company_type
        role
      }
    }`,

    addUser: `mutation createSingleUser($input:UsersInput) {
          createUser(input: $input) {
              fullname
          }
  	}`,

  	updateUser: `mutation updateSingleUser($userId: Int!, $input:UsersInput) {
          updateUser(user_id: $userId, input: $input) {
              user_id
          }
  	}`,

  	deleteUser: `mutation deleteSingleUser($userId: Int!) {
	      deleteUser(user_id: $userId) {
	          user_id
	      }
  	}`,

    allCommerce: `query getAllItem {
	    commerces {
	      _id
	      name
	      price
	      qty
	      description
	      category
	      user
	      user_id
	      image
	    }
  	}`,

    singleCommerce: `query getSingleItem($itemId: String!) {
	    commerce(_id: $itemId) {
	      _id
	      name
	      price
	      qty
	      description
	      category
	      user
	      user_id
	      image
	    }
  	}`,

  	addCommerce: `mutation createSingleCommerce($input:CommerceInput) {
	      createCommerce(input: $input) {
	          name
	      }
  	}`,

  	updateCommerce: `mutation updateSingleCommerce($itemId: String!, $input:CommerceInput) {
          updateCommerce(_id: $itemId, input: $input) {
              name
          }
 	}`,

 	deleteCommerce: `mutation deleteSingleCommerce($itemId: String!) {
          deleteCommerce(_id: $itemId) {
              name
          }
  	}`,

  	allRole: `query getAllRole {
	    roles {
	        role_name
	    }
  	}`,

  	allPlugin: `query getAllPlugin {
        plugins {
          name
          status
        }
  	}`,

  	allReport: `query getAllReport {
	    reports {
	        report_id
	        user_id
	        year
	        term
	        report_type
	        currency
	        rate
	        approved
	        flagged_for_deletion
	    }
  	}`,

  	allBalance: `query getAllBalance {
	    balances {
	        balance_id
	        report_id
	        detail
	        value
	        category
	        sub_category
	    }
  	}`,

  	addBalance: `mutation createSingleBalance($input:BalancesInput) {
	      createBalance(input: $input) {
	          balance_id
	      }
  	}`,

  	deleteBalance: `mutation deleteSingleBalance($balanceId: Int!) {
	      deleteBalance(balance_id: $balanceId) {
	          balance_id
	      }
  	}`,
}

export default query;