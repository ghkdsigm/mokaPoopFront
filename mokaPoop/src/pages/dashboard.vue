<template>
	<div class="min-h-screen bg-gray-50 flex flex-col items-center p-6">
		<h1 class="text-3xl font-bold text-gray-900 mb-6">MokaPoop</h1>
		<SensorChart />
	</div>
</template>

<script>
import SensorChart from '@/components/sensorchart.vue'

export default {
	name: 'Dashboard',
	components: {
		SensorChart,
	},
}
</script>

<style scoped>
/* Tailwind CSS 적용으로 별도 스타일 없음 */
</style>
