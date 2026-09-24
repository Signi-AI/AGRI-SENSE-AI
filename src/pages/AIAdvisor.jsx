import React, { useEffect, useRef, useState } from 'react'
import {
  Bot,
  Send,
  Sparkles,
  LoaderCircle,
  Mic,
  MicOff,
  Trash2,
} from 'lucide-react'
import { useLanguage } from '../i18n'

const API_URL = import.meta.env.VITE_API_URL

export function AIAdvisor() {
  const { t } = useLanguage()

  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)

  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: t('advisorWelcome'),
    },
  ])

  const recognitionRef = useRef(null)
  const listeningRef = useRef(false)

  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const microphoneStreamRef = useRef(null)
  const animationFrameRef = useRef(null)

  const finalTranscriptRef = useRef('')
  const interimTranscriptRef = useRef('')

  const suggestedQuestions = [
    'What crop should I plant in my soil?',
    'How can I improve my soil fertility?',
    'Is my soil pH suitable for crops?',
    'How can I improve nitrogen levels?',
    'What should I do during heavy rainfall?',
    'How can I protect my crops from pests?',
  ]

  // =========================================================
  // CHAT
  // =========================================================

  const sendQuestion = async (question) => {
    if (!question.trim() || loading) return

    const userMessage = question.trim()

    setMessages((v) => [
      ...v,
      {
        role: 'user',
        text: userMessage,
      },
    ])

    setQ('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ujumbe: userMessage,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.detail || 'Server error')
      }

      setMessages((v) => [
        ...v,
        {
          role: 'ai',
          text: json.jibu,
        },
      ])
    } catch (err) {
      console.error('Chat error:', err)

      setMessages((v) => [
        ...v,
        {
          role: 'ai',
          text:
            'Samahani, imeshindikana kupata jibu sasa hivi. Jaribu tena baadaye.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const send = (e) => {
    e.preventDefault()
    sendQuestion(q)
  }

  // =========================================================
  // DELETE MESSAGE
  // =========================================================

  const deleteMessage = (indexToDelete) => {
    setMessages((currentMessages) =>
      currentMessages.filter(
        (_, index) => index !== indexToDelete
      )
    )
  }

  // =========================================================
  // SUGGESTION
  // =========================================================

  const handleSuggestion = (question) => {
    setQ(question)
  }

  // =========================================================
  // AUDIO VISUALIZER
  // =========================================================

  const stopVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    if (microphoneStreamRef.current) {
      microphoneStreamRef.current
        .getTracks()
        .forEach((track) => track.stop())

      microphoneStreamRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {})
      audioContextRef.current = null
    }

    analyserRef.current = null
    setAudioLevel(0)
  }

  const startVisualizer = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        console.error(
          'Microphone API is not supported.'
        )

        return false
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        })

      microphoneStreamRef.current = stream

      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext

      if (!AudioContext) {
        return true
      }

      const audioContext = new AudioContext()

      audioContextRef.current = audioContext

      if (audioContext.state === 'suspended') {
        await audioContext.resume()
      }

      const analyser =
        audioContext.createAnalyser()

      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.75

      analyserRef.current = analyser

      const microphone =
        audioContext.createMediaStreamSource(
          stream
        )

      microphone.connect(analyser)

      const dataArray = new Uint8Array(
        analyser.frequencyBinCount
      )

      const updateWaveform = () => {
        if (
          !analyserRef.current ||
          !listeningRef.current
        ) {
          return
        }

        analyser.getByteTimeDomainData(
          dataArray
        )

        let sum = 0

        for (let i = 0; i < dataArray.length; i++) {
          const value = dataArray[i] - 128
          sum += value * value
        }

        const rms = Math.sqrt(
          sum / dataArray.length
        )

        const normalizedLevel = Math.min(
          100,
          rms * 3.5
        )

        setAudioLevel(normalizedLevel)

        animationFrameRef.current =
          requestAnimationFrame(
            updateWaveform
          )
      }

      updateWaveform()

      return true
    } catch (error) {
      console.error(
        'Microphone permission error:',
        error
      )

      return false
    }
  }

  // =========================================================
  // STOP MICROPHONE
  // =========================================================

  const stopVoiceInput = () => {
    console.log('Stopping microphone')

    listeningRef.current = false
    setListening(false)

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch (error) {
        console.log(
          'Recognition already stopped.'
        )
      }

      recognitionRef.current = null
    }

    stopVisualizer()

    finalTranscriptRef.current = ''
    interimTranscriptRef.current = ''
  }

  // =========================================================
  // CREATE SPEECH RECOGNITION
  // =========================================================

  const createRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      return null
    }

    const recognition = new SpeechRecognition()

    /*
     * Continuous mode keeps the microphone active.
     */
    recognition.continuous = true

    /*
     * Interim results make words appear
     * while the user is speaking.
     */
    recognition.interimResults = true

    recognition.maxAlternatives = 1

    /*
     * Browser SpeechRecognition supports one language
     * per recognition instance.
     *
     * We start with Swahili because the app is intended
     * for Tanzanian users. If the browser ends recognition,
     * we automatically alternate between Swahili and English.
     */
    recognition.lang = 'sw-TZ'

    recognition.onresult = (event) => {
      let finalText = ''
      let interimText = ''

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript

        if (event.results[i].isFinal) {
          finalText += transcript + ' '
        } else {
          interimText += transcript
        }
      }

      if (finalText) {
        finalTranscriptRef.current += finalText
      }

      interimTranscriptRef.current =
        interimText

      const combinedText =
        `${finalTranscriptRef.current} ${interimTranscriptRef.current}`
          .replace(/\s+/g, ' ')
          .trim()

      if (combinedText) {
        setQ(combinedText)
      }
    }

    recognition.onerror = (event) => {
      console.error(
        'Speech recognition error:',
        event.error
      )

      /*
       * Permission errors should stop the microphone.
       *
       * Other temporary errors are allowed to recover.
       */
      if (
        event.error === 'not-allowed' ||
        event.error ===
          'service-not-allowed'
      ) {
        stopVoiceInput()
      }
    }

    recognition.onend = () => {
      /*
       * If user manually stopped the microphone,
       * do not restart it.
       */
      if (!listeningRef.current) {
        return
      }

      /*
       * Chrome can stop SpeechRecognition automatically.
       *
       * Restart it automatically so the microphone
       * remains active.
       */
      setTimeout(() => {
        if (!listeningRef.current) {
          return
        }

        try {
          recognition.start()

          console.log(
            'Speech recognition restarted'
          )
        } catch (error) {
          /*
           * If this recognition instance cannot restart,
           * create a fresh one.
           */
          try {
            const newRecognition =
              createRecognition()

            if (!newRecognition) {
              stopVoiceInput()
              return
            }

            recognitionRef.current =
              newRecognition

            newRecognition.start()
          } catch (restartError) {
            console.error(
              'Could not restart speech recognition:',
              restartError
            )
          }
        }
      }, 300)
    }

    recognition.onspeechstart = () => {
      console.log('Speech detected')
    }

    recognition.onspeechend = () => {
      /*
       * IMPORTANT:
       * Speech ending does NOT stop the microphone.
       */
      console.log(
        'Speech ended - microphone remains active'
      )
    }

    recognition.onnomatch = () => {
      console.log(
        'No speech match found'
      )
    }

    return recognition
  }

  // =========================================================
  // START MICROPHONE
  // =========================================================

  const startVoiceInput = async () => {
    if (loading) return

    /*
     * Clicking microphone again stops it.
     */
    if (listeningRef.current) {
      stopVoiceInput()
      return
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert(
        'Speech recognition haipatikani kwenye browser hii. Tafadhali tumia Google Chrome au Microsoft Edge.'
      )

      return
    }

    const visualizerStarted =
      await startVisualizer()

    if (!visualizerStarted) {
      alert(
        'Imeshindikana kupata microphone. Tafadhali ruhusu microphone kwenye browser yako.'
      )

      return
    }

    /*
     * Keep any text already typed.
     */
    finalTranscriptRef.current =
      q.trim()
        ? `${q.trim()} `
        : ''

    interimTranscriptRef.current = ''

    listeningRef.current = true

    setListening(true)

    const recognition =
      createRecognition()

    if (!recognition) {
      stopVoiceInput()
      return
    }

    recognitionRef.current =
      recognition

    try {
      recognition.start()

      console.log(
        'Microphone started'
      )
    } catch (error) {
      console.error(
        'Could not start recognition:',
        error
      )

      stopVoiceInput()
    }
  }

  // =========================================================
  // CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {
      listeningRef.current = false

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (error) {}
      }

      stopVisualizer()
    }
  }, [])

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="mx-auto max-w-4xl px-4 py-7 sm:px-8">
      <p className="section-kicker">
        {t('intelligence')}
      </p>

      <h1 className="text-3xl font-extrabold sm:text-4xl">
        {t('advisor')}
      </h1>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Ask AgriSense AI about your farm, soil,
        crops, weather, or farming practices.
      </p>

      <div className="card mt-8 overflow-hidden">

        {/* =================================================
            CHAT
        ================================================= */}

        <div className="max-h-[55vh] space-y-4 overflow-y-auto p-5 sm:p-6">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`group flex gap-3 ${
                m.role === 'user'
                  ? 'justify-end'
                  : ''
              }`}
            >
              <div
                className={`relative max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 pr-10 text-sm leading-6 ${
                  m.role === 'user'
                    ? 'bg-forest text-white'
                    : 'bg-mint text-forest dark:bg-green-950/40 dark:text-green-100'
                }`}
              >
                {m.role === 'ai' && (
                  <Bot
                    size={15}
                    className="mb-1 mr-2 inline"
                  />
                )}

                {m.text}

                {/* DELETE MESSAGE */}
                <button
                  type="button"
                  onClick={() =>
                    deleteMessage(i)
                  }
                  aria-label="Delete message"
                  title="Delete message"
                  className={`absolute right-2 top-2 rounded-md p-1.5 transition ${
                    m.role === 'user'
                      ? 'text-white/60 hover:bg-white/10 hover:text-white'
                      : 'text-slate-400 hover:bg-black/5 hover:text-red-500 dark:hover:bg-white/10'
                  }`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="relative max-w-[85%] rounded-2xl bg-mint px-4 py-3 pr-10 text-sm text-forest dark:bg-green-950/40 dark:text-green-100">
                <LoaderCircle
                  size={15}
                  className="mr-2 inline animate-spin"
                />

                Inaandika...

                <button
                  type="button"
                  onClick={() =>
                    deleteMessage(
                      messages.length
                    )
                  }
                  className="absolute right-2 top-2"
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =================================================
            SUGGESTED QUESTIONS
        ================================================= */}

        <div className="border-t px-4 py-4 dark:border-white/10 sm:px-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles
              size={17}
              className="text-leaf"
            />

            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Suggested questions
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map(
              (question, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    handleSuggestion(question)
                  }
                  className="rounded-full border border-green-200 bg-green-50 px-3 py-2 text-left text-xs font-semibold text-forest transition hover:border-leaf hover:bg-green-100 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-100 dark:hover:bg-green-950/60 sm:text-sm"
                >
                  {question}
                </button>
              )
            )}
          </div>
        </div>

        {/* =================================================
            INPUT
        ================================================= */}

        <form
          onSubmit={send}
          className="border-t p-4 dark:border-white/10"
        >
          <div className="flex items-center gap-2">

            {/* INPUT */}
            <div className="relative min-w-0 flex-1">

              <input
                className={`input w-full min-w-0 ${
                  listening
                    ? 'border-green-500 pr-36'
                    : 'pr-14'
                }`}
                value={q}
                onChange={(e) =>
                  setQ(e.target.value)
                }
                placeholder={
                  listening
                    ? 'Sikiliza...'
                    : t('askFarm')
                }
                disabled={loading}
              />

              {/* LIVE WAVEFORM */}
              {listening && (
                <div className="pointer-events-none absolute right-14 top-1/2 flex h-8 -translate-y-1/2 items-center gap-[2px]">
                  {Array.from({
                    length: 20,
                  }).map((_, index) => {
                    const center =
                      Math.abs(
                        index - 9.5
                      )

                    const wave =
                      Math.max(
                        0.15,
                        1 - center / 10
                      )

                    const height =
                      5 +
                      audioLevel *
                        wave *
                        (0.35 +
                          ((index * 7) % 5) /
                            10)

                    return (
                      <span
                        key={index}
                        className="w-[2px] rounded-full bg-green-500 transition-all duration-75"
                        style={{
                          height: `${Math.min(
                            28,
                            height
                          )}px`,
                          opacity:
                            0.45 +
                            Math.min(
                              0.55,
                              audioLevel / 100
                            ),
                        }}
                      />
                    )
                  })}
                </div>
              )}

              {/* MICROPHONE */}
              <button
                type="button"
                onClick={
                  startVoiceInput
                }
                disabled={loading}
                aria-label={
                  listening
                    ? 'Stop listening'
                    : 'Start microphone'
                }
                title={
                  listening
                    ? 'Stop listening'
                    : 'Start microphone'
                }
                className={`absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition ${
                  listening
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                    : 'text-slate-500 hover:bg-green-50 hover:text-forest dark:text-slate-400 dark:hover:bg-green-950/40'
                }`}
              >
                {listening ? (
                  <MicOff size={19} />
                ) : (
                  <Mic size={19} />
                )}
              </button>
            </div>

            {/* SEND */}
            <button
              type="submit"
              disabled={
                loading || !q.trim()
              }
              aria-label="Send"
              className="btn-primary shrink-0 px-4"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default AIAdvisor