import React, { useState } from 'react'
import { Bot, Send, Sparkles } from 'lucide-react'
import { useLanguage } from '../i18n'

export function AIAdvisor() {
  const { t } = useLanguage()

  const [q, setQ] = useState('')

  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: t('advisorWelcome'),
    },
  ])

  const suggestedQuestions = [
    'What crop should I plant in my soil?',
    'How can I improve my soil fertility?',
    'Is my soil pH suitable for crops?',
    'How can I improve nitrogen levels?',
    'What should I do during heavy rainfall?',
    'How can I protect my crops from pests?',
  ]

  const sendQuestion = (question) => {
    if (!question.trim()) return

    setMessages((v) => [
      ...v,
      {
        role: 'user',
        text: question,
      },
      {
        role: 'ai',
        text: t('demoResponse'),
      },
    ])

    setQ('')
  }

  const send = (e) => {
    e.preventDefault()
    sendQuestion(q)
  }

  const handleSuggestion = (question) => {
    setQ(question)
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-7 sm:px-8">
      <p className="section-kicker">{t('intelligence')}</p>

      <h1 className="text-3xl font-extrabold sm:text-4xl">
        {t('advisor')}
      </h1>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Ask AgriSense AI about your farm, soil, crops, weather, or farming
        practices.
      </p>

      <div className="card mt-8 overflow-hidden">

        {/* Chat Messages */}
        <div className="max-h-[55vh] space-y-4 overflow-y-auto p-5 sm:p-6">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${
                m.role === 'user' ? 'justify-end' : ''
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
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
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Questions */}
        <div className="border-t px-4 py-4 dark:border-white/10 sm:px-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={17} className="text-leaf" />

            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
              Suggested questions
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestion(question)}
                className="rounded-full border border-green-200 bg-green-50 px-3 py-2 text-left text-xs font-semibold text-forest transition hover:border-leaf hover:bg-green-100 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-100 dark:hover:bg-green-950/60 sm:text-sm"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={send}
          className="border-t p-4 dark:border-white/10"
        >
          <div className="flex gap-2">
            <input
              className="input min-w-0 flex-1"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('askFarm')}
            />

            <button
              type="submit"
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