export function detectSound(stream: MediaStream, callback: (speaking: boolean) => void) {
  const audioContext = new AudioContext()
  const source = audioContext.createMediaStreamSource(stream)
  const analyser = audioContext.createAnalyser()
  const dataArray = new Uint8Array(analyser.fftSize)

  source.connect(analyser)

  function checkAudio() {
    analyser.getByteTimeDomainData(dataArray)
    let sum = 0
    for (let i = 0; i < dataArray.length; i++) {
      const value = (dataArray[i] - 128) / 128
      sum += value * value
    }
    const volume = Math.sqrt(sum / dataArray.length)

    callback(volume > 0.02)
    requestAnimationFrame(checkAudio)
  }

  checkAudio()
}