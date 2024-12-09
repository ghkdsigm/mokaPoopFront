<template>
	<div id="app">
		<Dashboard />
	</div>
</template>

<script>
import Dashboard from '@/pages/dashboard.vue'

export default {
	name: 'App',
	components: {
		Dashboard,
	},
}
</script>

<style>
/* Tailwind CSS 적용으로 별도 스타일 없음 */
</style>
