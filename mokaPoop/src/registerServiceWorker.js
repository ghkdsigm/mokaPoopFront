if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker
			.register('/service-worker.js')
			.then(registration => {
				console.log('Service Worker 등록 성공:', registration)
			})
			.catch(error => {
				console.error('Service Worker 등록 실패:', error)
			})
	})

	// 새 버전이 배포되었을 때 자동 새로고침 처리
	navigator.serviceWorker.addEventListener('controllerchange', () => {
		console.log('새 버전이 배포되었습니다. 페이지를 새로고침합니다.')
		window.location.reload()
	})
}
