<!-- Alert형 팝업 -->
<template>
	<div
		v-if="visible"
		class="absolute m-auto inset-0 flex justify-center items-center bg-white max-w-[400px] max-h-[400px] rounded-[15px] shadow-[2px_2px_1px_1px_#00000042]"
	>
		<div class="popupBg absolute inset-0 bg-gray-900 opacity-50"></div>
		<div
			class="popup flex items-center justify-center flex-col bg-white rounded-lg shadow-lg p-6 w-[90vw] max-w-[50.6vw] h-[22.5vw] relative z-10"
		>
			<!-- Popup Title -->
			<h2 class="text-xl font-bold mb-[1.6vw] w-[10.5vw]">{{ title }}</h2>
			<!-- Popup Content -->
			<div class="mb-[1.6vw] text-center text-[1.5vw]">
				<slot name="content">Default Content</slot>
			</div>
			<!-- Popup Actions -->
			<div class="flex justify-end space-x-4 w-[10.8vw] h-[6.3vh]">
				<button
					@click="cancel"
					class="w-full h-full flex justify-center items-center px-4 py-2 bg-[#00B0B9] text-white rounded text-[0.94vw]"
				>
					<!-- <img v-if="ico" :src="`@/assets/img/popup/${ico}`" class="pr-[0.5vw]" /> -->
					{{ cancelText }}
				</button>
				<button
					@click="confirm"
					class="w-full h-full flex justify-center items-center px-4 py-2 bg-[#00B0B9] text-white rounded text-[0.94vw]"
				>
					<!-- <img v-if="ico" :src="`@/assets/img/popup/${ico}`" class="pr-[0.5vw]" /> -->
					{{ confirmText }}
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { defineComponent, toRefs } from 'vue'

export default defineComponent({
	name: 'Popup01',
	props: {
		title: {
			type: String,
			default: 'Popup Title',
		},
		confirmText: {
			type: String,
			default: '네',
		},
		cancelText: {
			type: String,
			default: '아니요',
		},
		visible: {
			type: Boolean,
			default: false,
		},
		ico: {
			type: String,
			default: '',
		},
	},
	emits: ['confirm', 'cancel', 'update:visible'],
	setup(props, { emit }) {
		const { title, confirmText, cancelText, visible } = toRefs(props)

		const close = () => {
			emit('update:visible', false)
		}

		const confirm = () => {
			emit('confirm')
			close()
		}

		const cancel = () => {
			emit('cancel')
			close()
		}

		return {
			title,
			confirmText,
			cancelText,
			visible,
			close,
			confirm,
			cancel,
		}
	},
})
</script>

<style scoped>
.popup {
	position: absolute;
	margin: auto;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background: #fff;
	max-width: 400px;
	max-height: 400px;
	border-radius: 15px;
	box-shadow: 2px 2px 1px 1px #00000042;
}
.popupBg {
	width: 100%;
	height: 100%;
	background: #000000;
	position: absolute;
	top: 0;
	left: 0;
	opacity: 0.6;
}
</style>
