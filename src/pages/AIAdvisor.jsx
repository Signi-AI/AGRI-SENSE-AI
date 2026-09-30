import React, { useEffect, useRef, useState } from 'react'
import { Bot, Send, Sparkles, LoaderCircle, Mic, MicOff, Trash2 } from 'lucide-react'
import { useLanguage } from '../i18n'
import './Auth.jsx'

const API_URL = import.meta.env.VITE_API_URL

export function AIAdvisor() {
  const { t, lang } = useLanguage()

  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)

  const [messages, setMessages] = useState([{ role: 'ai', text: t('advisorWelcome') }])

  const recognitionRef = useRef(null)
  const listeningRef = useRef(false)

  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const microphoneStreamRef = useRef(null)
  const animationFrameRef = useRef(null)

  const finalTranscriptRef = useRef('')
  const interimTranscriptRef = useRef('')

  // =========================================================
  // LANGUAGE-AWARE SUGGESTIONS
  // =========================================================

  const suggestedQuestions =
    lang === 'SW'
      ? [
          'Ni zao gani linafaa kupandwa kwenye udongo wangu?',
          'Ninawezaje kuboresha rutuba ya udongo wangu?',
          'Je, pH ya udongo wangu inafaa kwa mazao?',
          'Ninawezaje kuongeza kiwango cha nitrojeni?',
          'Nifanye nini wakati wa mvua kubwa?',
          'Ninawezaje kulinda mazao yangu dhidi ya wadudu?',
        ]
      : [
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

    // Stop microphone when sending a voice question
    if (listeningRef.current) {
      stopVoiceInput()
    }

    setMessages((currentMessages) => [...currentMessages, { role: 'user', text: userMessage }])

    setQ('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ujumbe: userMessage }),
      })

      let json = {}

      try {
        json = await res.json()
      } catch {
        json = {}
      }

      if (!res.ok) {
        throw new Error(json?.detail || json?.message || 'Server error')
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'ai', text: json?.jibu || t('chatError') },
      ])
    } catch (err) {
      console.error('Chat error:', err)

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: 'ai', text: t('chatError') },
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
      currentMessages.filter((_, index) => index !== indexToDelete)
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
      microphoneStreamRef.current.getTracks().forEach((track) => track.stop())
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
        console.error('Microphone API is not supported.')
        return false
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      microphoneStreamRef.current = stream

      const AudioContext = window.AudioContext || window.webkitAudioContext

      if (!AudioContext) {
        return true
      }

      const audioContext = new AudioContext()

      audioContextRef.current = audioContext

      if (audioContext.state === 'suspended') {
        await audioContext.resume()
      }

      const analyser = audioContext.createAnalyser()

      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.75

      analyserRef.current = analyser

      const microphone = audioContext.createMediaStreamSource(stream)

      microphone.connect(analyser)

      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      const updateWaveform = () => {
        if (!analyserRef.current || !listeningRef.current) {
          return
        }

        analyser.getByteTimeDomainData(dataArray)

        let sum = 0

        for (let i = 0; i < dataArray.length; i++) {
          const value = dataArray[i] - 128
          sum += value * value
        }

        const rms = Math.sqrt(sum / dataArray.length)

        const normalizedLevel = Math.min(100, rms * 3.5)

        setAudioLevel(normalizedLevel)

        animationFrameRef.current = requestAnimationFrame(updateWaveform)
      }

      updateWaveform()

      return true
    } catch (error) {
      console.error('Microphone permission error:', error)
      return false
    }
  }

  // =========================================================
  // STOP MICROPHONE
  // =========================================================

  const stopVoiceInput = () => {
    listeningRef.current = false
    setListening(false)

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch {
        // Recognition already stopped
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
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      return null
    }

    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    /*
     * Use the selected application language.
     * Swahili is the default language for Tanzanian users.
     */
    recognition.lang = lang === 'SW' ? 'sw-TZ' : 'en-US'

    recognition.onresult = (event) => {
      let finalText = ''
      let interimText = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          finalText += `${transcript} `
        } else {
          interimText += transcript
        }
      }

      if (finalText) {
        finalTranscriptRef.current += finalText
      }

      interimTranscriptRef.current = interimText

      const combinedText = `${finalTranscriptRef.current} ${interimTranscriptRef.current}`
        .replace(/\s+/g, ' ')
        .trim()

      if (combinedText) {
        setQ(combinedText)
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)

      /*
       * Permission-related errors should stop
       * the microphone completely.
       */
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        stopVoiceInput()
      }
    }

    recognition.onend = () => {
      /*
       * If the user manually stopped listening,
       * do not restart recognition.
       */
      if (!listeningRef.current) {
        return
      }

      /*
       * Browsers such as Chrome can automatically
       * stop SpeechRecognition. Restart it so the
       * microphone remains active.
       */
      setTimeout(() => {
        if (!listeningRef.current) {
          return
        }

        try {
          recognition.start()

          console.log('Speech recognition restarted')
        } catch (error) {
          /*
           * If the existing instance cannot restart,
           * create a fresh recognition instance.
           */
          try {
            const newRecognition = createRecognition()

            if (!newRecognition) {
              stopVoiceInput()
              return
            }

            recognitionRef.current = newRecognition

            newRecognition.start()
          } catch (restartError) {
            console.error('Could not restart speech recognition:', restartError)
          }
        }
      }, 300)
    }

    recognition.onspeechstart = () => {
      console.log('Speech detected')
    }

    recognition.onspeechend = () => {
      /*
       * Speech ending does not stop the microphone.
       */
      console.log('Speech ended - microphone remains active')
    }

    recognition.onnomatch = () => {
      console.log('No speech match found')
    }

    return recognition
  }

  // =========================================================
  // START MICROPHONE
  // =========================================================

  const startVoiceInput = async () => {
    if (loading) return

    /*
     * Clicking the microphone again stops listening.
     */
    if (listeningRef.current) {
      stopVoiceInput()
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert(t('microphoneUnavailable'))
      return
    }

    const visualizerStarted = await startVisualizer()

    if (!visualizerStarted) {
      alert(t('microphonePermission'))
      return
    }

    /*
     * Keep any text that was already typed.
     */
    finalTranscriptRef.current = q.trim() ? `${q.trim()} ` : ''

    interimTranscriptRef.current = ''

    listeningRef.current = true
    setListening(true)

    const recognition = createRecognition()

    if (!recognition) {
      stopVoiceInput()
      return
    }

    recognitionRef.current = recognition

    try {
      recognition.start()

      console.log('Microphone started')
    } catch (error) {
      console.error('Could not start recognition:', error)

      stopVoiceInput()
    }
  }

  // =========================================================
  // UPDATE WELCOME MESSAGE WHEN LANGUAGE CHANGES
  // =========================================================

  useEffect(() => {
    setMessages((currentMessages) => {
      if (currentMessages.length === 1 && currentMessages[0].role === 'ai') {
        return [{ role: 'ai', text: t('advisorWelcome') }]
      }

      return currentMessages
    })
  }, [lang, t])

  // =========================================================
  // CLEANUP
  // =========================================================

  useEffect(() => {
    return () => {
      listeningRef.current = false

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {
          // Recognition already stopped
        }

        recognitionRef.current = null
      }

      stopVisualizer()
    }
  }, [])

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="neu-surface mx-auto max-w-4xl px-4 py-7 sm:px-8">
      {/* HEADER */}
      <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">
        {t('intelligence')}
      </p>

      <h1 className="text-3xl font-extrabold text-[color:var(--neu-text)] sm:text-4xl">
        {t('advisor')}
      </h1>

      <p className="mt-2 text-sm text-[color:var(--neu-muted)]">
        {lang === 'SW'
          ? 'Uliza AgriSense AI kuhusu shamba lako, udongo, mazao, hali ya hewa au mbinu za kilimo.'
          : 'Ask AgriSense AI about your farm, soil, crops, weather, or farming practices.'}
      </p>

      {/* CHAT CONTAINER */}
      <div className="neu-raised mt-8 overflow-hidden rounded-3xl">
        {/* MESSAGES */}
        <div className="max-h-[55vh] space-y-5 overflow-y-auto p-5 sm:p-6">
          {messages.map((m, i) => (
            <div key={i} className={`group flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
              <div
                className={`relative max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 pr-10 text-sm leading-6 ${
                  m.role === 'user'
                    ? 'neu-raised-sm bg-[color:var(--neu-accent)] text-white'
                    : 'neu-inset text-[color:var(--neu-text)]'
                }`}
              >
                {m.role === 'ai' && (
                  <Bot size={15} className="mb-1 mr-2 inline text-[color:var(--neu-accent)]" />
                )}

                {m.text}

                {/* DELETE MESSAGE */}
                <button
                  type="button"
                  onClick={() => deleteMessage(i)}
                  aria-label={t('deleteMessage')}
                  title={t('deleteMessage')}
                  className={`absolute right-2 top-2 rounded-md p-1.5 transition ${
                    m.role === 'user'
                      ? 'text-white/70 hover:bg-white/10 hover:text-white'
                      : 'text-[color:var(--neu-muted)] hover:text-red-500'
                  }`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {/* LOADING */}
          {loading && (
            <div className="flex gap-3">
              <div className="neu-inset relative max-w-[85%] rounded-2xl px-4 py-3 pr-10 text-sm text-[color:var(--neu-text)]">
                <LoaderCircle
                  size={15}
                  className="mr-2 inline animate-spin text-[color:var(--neu-accent)]"
                />

                {t('typing')}
              </div>
            </div>
          )}
        </div>

        {/* SUGGESTED QUESTIONS */}
        <div className="border-t border-[color:var(--neu-dark)] px-4 py-4 sm:px-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={17} className="text-[color:var(--neu-accent)]" />

            <p className="text-sm font-bold text-[color:var(--neu-text)]">
              {t('suggestedQuestions')}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestion(question)}
                disabled={loading}
                className="neu-raised-sm neu-pressable rounded-full px-4 py-2 text-left text-xs font-semibold text-[color:var(--neu-text)] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* INPUT */}
        <form onSubmit={send} className="border-t border-[color:var(--neu-dark)] p-4">
          <div className="flex items-center gap-3">
            {/* INPUT AREA */}
            <div className="relative min-w-0 flex-1">
              <input
                className={`neu-inset h-12 w-full min-w-0 rounded-full bg-transparent pl-5 text-sm text-[color:var(--neu-text)] outline-none placeholder:text-[color:var(--neu-muted)] focus-visible:ring-2 focus-visible:ring-[color:var(--neu-accent)] disabled:opacity-60 ${
                  listening ? 'pr-36' : 'pr-14'
                }`}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={listening ? t('listening') : t('askFarm')}
                disabled={loading}
              />

              {/* LIVE WAVEFORM */}
              {listening && (
                <div className="pointer-events-none absolute right-14 top-1/2 flex h-8 -translate-y-1/2 items-center gap-[2px]">
                  {Array.from({ length: 20 }).map((_, index) => {
                    const center = Math.abs(index - 9.5)

                    const wave = Math.max(0.15, 1 - center / 10)

                    const height = 5 + audioLevel * wave * (0.35 + ((index * 7) % 5) / 10)

                    return (
                      <span
                        key={index}
                        className="w-[2px] rounded-full bg-[color:var(--neu-accent)] transition-all duration-75"
                        style={{
                          height: `${Math.min(28, height)}px`,
                          opacity: 0.45 + Math.min(0.55, audioLevel / 100),
                        }}
                      />
                    )
                  })}
                </div>
              )}

              {/* MICROPHONE */}
              <button
                type="button"
                onClick={startVoiceInput}
                disabled={loading}
                aria-label={listening ? t('stopListening') : t('startMicrophone')}
                title={listening ? t('stopListening') : t('startMicrophone')}
                className={`absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full transition ${
                  listening
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                    : 'neu-raised-sm neu-pressable text-[color:var(--neu-text)]'
                }`}
              >
                {listening ? <MicOff size={19} /> : <Mic size={19} />}
              </button>
            </div>

            {/* SEND */}
            <button
              type="submit"
              disabled={loading || !q.trim()}
              aria-label={t('send')}
              title={t('send')}
              className="neu-raised-sm neu-pressable flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[color:var(--neu-accent)] text-white disabled:cursor-not-allowed disabled:opacity-50"
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