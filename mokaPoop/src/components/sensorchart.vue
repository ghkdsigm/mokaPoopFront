<template>
	<div class="w-full p-4 bg-gray-100 shadow rounded-lg">
		<h2 class="text-xl font-semibold text-gray-800 mb-4">MokaPoop Senser</h2>
		<div class="relative h-80">
			<!-- Line Chart -->
			<line-chart
				:chart-data="chartData"
				:chart-options="chartOptions"
			/>

			<!-- Poop Data List -->
			<ul>
				<li
					v-for="(item, idx) in poopData"
					:key="idx"
					class="list-none"
				>
					<p v-if="item.type === 'hand'">
						{{ `${formatDate(item.time)}분에 ${puppy}가 대/소변을 보았습니다. 수동 청소를 시작합니다.` }}
					</p>
					<p v-else-if="item.type === 'handUpdate'">
						{{ `${formatDate(item.time)}분에 ${puppy}가 대/소변을 보았습니다. 수동 청소를 완료했습니다.` }}
					</p>
					<p v-else>
						{{ `${formatDate(item.time)}분에 ${puppy}가 대/소변을 보았습니다. 자동 청소를 시작합니다.` }}
					</p>
				</li>
			</ul>

			<!-- Buttons -->
			<div class="mt-4 flex gap-2">
				<button
					class="px-4 py-2 bg-blue-500 text-white rounded"
					:disabled="isConnected"
					@click="startConnection"
				>
					Start Connection
				</button>
				<button
					class="px-4 py-2 bg-red-500 text-white rounded"
					:disabled="!isConnected"
					@click="stopConnection"
				>
					Stop Connection
				</button>
				<button
					class="px-4 py-2 bg-yellow-500 text-white rounded"
					v-bind:disabled="!isConnected"
					@click="sendPoopSignal"
				>
					수동 청소
				</button>
			</div>
		</div>
		<!-- Popup -->
		<Popup01
			v-model:visible="isPopupVisible"
			title="수동 청소"
			@confirm="handleConfirm"
			@cancel="handleCancel"
		>
			<template #content>
				<p>{{ comment }}</p>
			</template>
		</Popup01>
	</div>
</template>

<script>
import { defineComponent, reactive, ref, computed } from 'vue'
import { LineChart } from 'vue-chart-3'
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	LineElement,
	CategoryScale,
	LinearScale,
	PointElement,
	LineController,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, LineController)

export default defineComponent({
	components: { LineChart },
	setup() {
		const isPopupVisible = ref(false)
		const isConnected = ref(false)
		const isHand = ref(false)
		const comment = ref('')
		const poopData = ref([])
		const puppy = ref('모카')
		const ws = ref(null)

		// Chart data structure
		const chartData = reactive({
			labels: [],
			datasets: [
				{
					label: '온도 (°C)',
					data: [],
					borderColor: 'rgba(75, 192, 192, 1)',
					backgroundColor: 'rgba(75, 192, 192, 0.2)',
					fill: true,
					tension: 0.4,
				},
				{
					label: '습도 (%)',
					data: [],
					borderColor: 'rgba(255, 99, 132, 1)',
					backgroundColor: 'rgba(255, 99, 132, 0.2)',
					fill: true,
					tension: 0.4,
				},
				{
					label: '압력 (%)',
					data: [],
					borderColor: 'rgba(54, 162, 235, 1)',
					backgroundColor: 'rgba(54, 162, 235, 0.2)',
					fill: true,
					tension: 0.4,
				},
			],
		})

		const chartOptions = {
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				x: { title: { display: true, text: 'Time' } },
				y: { title: { display: true, text: 'Value' }, beginAtZero: true, min: 0, max: 100 },
			},
		}

		const startConnection = () => {
			if (isConnected.value || ws.value) return

			ws.value = new WebSocket('ws://localhost:8002')

			ws.value.onopen = () => {
				console.log('WebSocket 연결됨')
				isConnected.value = true
			}

			ws.value.onmessage = event => {
				const message = JSON.parse(event.data)
				if (message.type === 'sensorUpdate') {
					const data = message.data

					if (data.poop === 'y') {
						poopData.value.push(data)
					}

					chartData.labels.push(new Date().toLocaleTimeString())
					if (chartData.labels.length > 10) {
						chartData.labels.shift()
					}

					chartData.datasets[0].data.push(data.temperature)
					chartData.datasets[1].data.push(data.humidity)
					chartData.datasets[2].data.push(data.press)
					if (chartData.datasets[0].data.length > 10) {
						chartData.datasets[0].data.shift()
						chartData.datasets[1].data.shift()
						chartData.datasets[2].data.shift()
					}
				}
				if (message.type === 'handUpdate') {
					const data = message.data
					poopData.value.push(data)
				}
			}

			ws.value.onclose = () => {
				console.log('WebSocket 연결 종료')
				isConnected.value = false
				ws.value = null
			}
		}

		const stopConnection = () => {
			if (ws.value) ws.value.close()
		}

		const sendPoopSignal = () => {
			isPopupVisible.value = true
			comment.value = '수동으로 청소를 진행하시겠습니까?'
		}

		const handleConfirm = () => {
			if (!ws.value || ws.value.readyState !== WebSocket.OPEN) return

			// 수동 청소를 요청하는 메시지
			const sensorData = { poop: 'y' }
			ws.value.send(JSON.stringify({ type: 'manualClean', data: sensorData }))
			console.log('Sent: ', sensorData)

			isPopupVisible.value = false
		}

		const handleCancel = () => {
			isPopupVisible.value = false
		}

		const formatDate = dateString => {
			const date = new Date(dateString)
			const formatted = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
			return formatted
		}

		return {
			isPopupVisible,
			chartData,
			chartOptions,
			poopData,
			puppy,
			isConnected,
			startConnection,
			stopConnection,
			sendPoopSignal,
			handleConfirm,
			handleCancel,
			formatDate,
			comment,
		}
	},
})
</script>

<style scoped>
/* Tailwind CSS 활용 */
</style>
