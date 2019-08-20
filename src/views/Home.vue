<template>
<d-container>
	<d-row>
		<d-col lg="12" sm="6" class="mb-4">
	    	<ao-summary-card-public />
	  	</d-col>
	</d-row>
	<d-row>
		<d-col lg="6" sm="6" class="mb-4">
	    	<ao-top-referrals />
	  	</d-col>
	  	<d-col lg="6" class="mb-4">
	    	<country-reports />
	  	</d-col>
	</d-row>
</d-container>
</template>

<script>
import TopReferrals from '@/components/common/TopReferrals.vue';
import CountryReports from '@/components/common/CountryReports.vue';
import SummaryCardPublic from '@/components/analytics/SummaryCardPublic.vue';
export default {
  name: 'home',
  components: {
  	aoTopReferrals: TopReferrals,
  	CountryReports,
  	aoSummaryCardPublic: SummaryCardPublic,
  },
};
</script>

<style scoped>

.container{
	padding-top: 6rem;
}

</style>
