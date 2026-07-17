'use client';

import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAgentWebSocket } from '../../hooks/useAgentSocket';
import { documentApi, Message } from '../../utils/api';

export default function CompliancePage() {
  useAgentWebSocket();

  const [sector, setSector] = useState('Chemicals');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [chatHistory]);

  const uploadMutation = useMutation({
    mutationFn: (variables: {
      file: File;
      sector: string;
    }) => documentApi.upload(variables.file, variables.sector),

    onSuccess: (data) => {
      setActiveDocId(data.documentId);
    },
  });

  const chatMutation = useMutation({
    mutationFn: (variables: {
      docId: string;
      query: string;
    }) => documentApi.queryContext(variables.docId, variables.query),

    onSuccess: (data) => {
      setChatHistory((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'agent',
          text: data.answer,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    },
  });

  const sendMessage = () => {
    if (!activeDocId || !chatInput.trim()) return;

    const text = chatInput;

    setChatHistory((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: 'user',
        text,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    setChatInput('');

    chatMutation.mutate({
      docId: activeDocId,
      query: text,
    });
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Compliance Knowledge Base
        </h1>

        <p className="mt-2 max-w-3xl text-neutral-500">
          Upload compliance documentation and interact with it using
          Retrieval-Augmented Generation powered by enterprise AI agents.
        </p>

      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-5">

        {/* LEFT */}

        <section className="xl:col-span-2">

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-neutral-900">
              Document Configuration
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Upload a regulatory document to build a searchable
              knowledge base.
            </p>

            {/* Industry */}

            <div className="mt-8">

              <label className="mb-2 block text-sm font-medium">
                Industry
              </label>

              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black"
              >
                <option>Chemicals</option>
                <option>Finance</option>
                <option>Healthcare</option>
                <option>Energy</option>
              </select>

            </div>

            {/* Upload */}

            <div className="mt-6">

              <input
                id="upload"
                type="file"
                accept=".pdf,.txt"
                className="hidden"
                onChange={(e) =>
                  setSelectedFile(e.target.files?.[0] || null)
                }
              />

              <label
                htmlFor="upload"
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 px-6 py-12 text-center transition hover:border-black hover:bg-neutral-50"
              >

                <svg
                  className="h-10 w-10 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 16V4m0 0l-4 4m4-4l4 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M5 20h14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <h3 className="mt-4 font-semibold">
                  Upload Compliance Document
                </h3>

                <p className="mt-2 text-sm text-neutral-500">
                  PDF or TXT • Drag & Drop or Click
                </p>

              </label>

            </div>

            {/* File */}

            {selectedFile && (

              <div className="mt-6 rounded-xl bg-neutral-50 p-4">

                <p className="text-xs uppercase tracking-wide text-neutral-500">
                  Selected Document
                </p>

                <p className="mt-2 truncate font-medium">
                  📄 {selectedFile.name}
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>

              </div>

            )}

            {/* Upload */}

            <button
              disabled={!selectedFile || uploadMutation.isPending}
              onClick={() =>
                selectedFile &&
                uploadMutation.mutate({
                  file: selectedFile,
                  sector,
                })
              }
              className="mt-8 w-full rounded-xl bg-black py-3 font-medium text-white transition hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-500"
            >
              {uploadMutation.isPending
                ? 'Uploading...'
                : 'Build Knowledge Base'}
            </button>

          </div>

        </section>

        {/* RIGHT */}

        <section className="xl:col-span-3">

          <div className="flex h-[720px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">

            {/* Header */}

            <div className="border-b border-neutral-200 px-6 py-5">

              <h2 className="text-lg font-semibold">
                AI Compliance Assistant
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Ask questions about the uploaded document.
              </p>

            </div>

            {/* Chat */}

            <div className="flex-1 overflow-y-auto bg-neutral-50 p-6">

              {!activeDocId ? (

                <div className="flex h-full flex-col items-center justify-center text-center">

                  <div className="mb-5 text-5xl">
                    📄
                  </div>

                  <h3 className="text-lg font-semibold">
                    No Document Uploaded
                  </h3>

                  <p className="mt-2 max-w-md text-neutral-500">
                    Upload a compliance document to begin
                    asking questions with Retrieval-Augmented
                    Generation.
                  </p>

                </div>

              ) : (

                <div className="space-y-5">

                  {chatHistory.map((msg) => {

                    const user = msg.sender === 'user';

                    return (

                      <div
                        key={msg.id}
                        className={`flex ${
                          user
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >

                        <div
                          className={`max-w-[75%] rounded-2xl px-5 py-4 shadow-sm ${
                            user
                              ? 'bg-black text-white'
                              : 'border border-neutral-200 bg-white'
                          }`}
                        >

                          <p className="whitespace-pre-wrap text-sm leading-7">
                            {msg.text}
                          </p>

                          <p
                            className={`mt-3 text-xs ${
                              user
                                ? 'text-neutral-300'
                                : 'text-neutral-400'
                            }`}
                          >
                            {msg.timestamp}
                          </p>

                        </div>

                      </div>

                    );
                  })}

                  <div ref={bottomRef} />

                </div>

              )}

            </div>

            {/* Input */}

            <div className="border-t border-neutral-200 p-5">

              <div className="flex gap-3">

                <input
                  value={chatInput}
                  disabled={!activeDocId}
                  onChange={(e) =>
                    setChatInput(e.target.value)
                  }
                  onKeyDown={(e) =>
                    e.key === 'Enter' && sendMessage()
                  }
                  placeholder="Ask about compliance requirements..."
                  className="flex-1 rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-black disabled:bg-neutral-100"
                />

                <button
                  onClick={sendMessage}
                  disabled={
                    !activeDocId ||
                    !chatInput.trim() ||
                    chatMutation.isPending
                  }
                  className="rounded-xl bg-black px-6 text-white transition hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-500"
                >
                  Send
                </button>

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}