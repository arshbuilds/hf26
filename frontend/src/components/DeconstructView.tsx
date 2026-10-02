"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Timer, Play, Pause, RotateCcw, CheckCircle2, HeartHandshake, ShieldCheck } from "lucide-react";

interface DeconstructViewProps {
  friendName: string;
}

export default function DeconstructView({ friendName }: DeconstructViewProps) {
  const [task, setTask] = useState("Study 4 chapters of Distributed Systems and clean my chaotic desk");
  const [emotion, setEmotion] = useState("Task Paralysis");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);

  // 2-minute timer state
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDeconstruct = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/api/deconstruct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task,
          emotional_state: emotion,
          friend_name: friendName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.plan);
        setProvider(data.provider || "Kaizen Open-Weight Engine");
      } else {
        throw new Error("Backend response error");
      }
    } catch {
      // Offline client fallback
      const fallbackPlan = `### 🌱 Mindset Grounding
Breathe out, ${friendName}. You don't have to conquer "${task}" today. You only need to touch it for 120 seconds. Perfection is not required; only presence.

---

### ⏱️ Step 1: The Zero-Resistance Entry Point (2 Minutes)
* **Action:** Sit down, open your workspace or notebook, and write down the single title: **"${task}"**.
* **Friction Breaker:** Do not attempt to solve it yet. Just write the heading and step back.
* **Why it works:** Overcoming the physical threshold of starting resolves 80% of executive dysfunction.

---

### ☕ Step 2: The Sensory Reset (2 Minutes)
* **Action:** Pour a fresh glass of water, put on calm noise cancellation, and take 3 deep belly breaths.
* **Friction Breaker:** Keep your hands off incoming messages.
* **Why it works:** Regulates your nervous system away from the "${emotion}" state.

---

### 🚀 Step 3: The Atomic Seed (2 Minutes)
* **Action:** Pick the single smallest, laughably easy sub-part of this task and work on it for exactly 2 minutes using the timer below.
* **Friction Breaker:** When the timer rings, you have full permission to walk away immediately if you want to.
* **Why it works:** Action creates momentum, not waiting for motivation.

---

*"Small steps done with kindness defeat paralysis every single time. Proud of you for starting, ${friendName}."*`;
      setResult(fallbackPlan);
      setProvider("Kaizen Offline Heuristic Engine (Local Fallback)");
    } finally {
      setLoading(false);
      setTimeLeft(120);
      setIsTimerRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#e7e5de] shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-[#ecfdf5] text-[#059669]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1e332d]">2-Minute Micro-Action Deconstruction</h2>
            <p className="text-sm text-[#556b64]">
              Overcome ADHD paralysis and overwhelm by turning daunting tasks into frictionless 120-second steps.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-[#556b64] uppercase tracking-wider">
              What task feels heavy right now?
            </label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g. Write lab report, file expenses, clean kitchen counter..."
              className="w-full px-4 py-3 rounded-xl border border-[#d5d3cb] bg-[#faf9f5] text-[#1e332d] focus:outline-none focus:ring-2 focus:ring-[#233d36]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#556b64] uppercase tracking-wider">
              Current Emotion / State
            </label>
            <select
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#d5d3cb] bg-[#faf9f5] text-[#1e332d] focus:outline-none focus:ring-2 focus:ring-[#233d36]"
            >
              <option value="Task Paralysis">Task Paralysis (Frozen)</option>
              <option value="Brain Fog & Fatigue">Brain Fog & Fatigue</option>
              <option value="Anxious & Overwhelmed">Anxious & Overwhelmed</option>
              <option value="Scattered Focus">Scattered Focus</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={handleDeconstruct}
            disabled={loading || !task.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#233d36] text-white font-medium hover:bg-[#182a25] transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? "Deconstructing..." : "Deconstruct with Kaizen"}
          </button>
        </div>
      </div>

      {/* Plan Output */}
      {result && (
        <div className="bg-white rounded-2xl p-6 border border-[#e7e5de] shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#f0eee6] pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#059669] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Tailored Kaizen Plan for {friendName}
            </span>
            <span className="text-xs text-[#60726d] bg-[#f4f2ea] px-3 py-1 rounded-full">
              Engine: {provider}
            </span>
          </div>

          <div className="prose max-w-none text-[#2d453e] whitespace-pre-line leading-relaxed text-sm md:text-base">
            {result}
          </div>

          {/* Interactive 2-Minute Timer */}
          <div className="pt-4 border-t border-[#f0eee6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#faf9f5] p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#e6f4ea] text-[#137333]">
                <Timer className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1e332d]">2-Minute Kaizen Momentum Timer</p>
                <p className="text-xs text-[#556b64]">Work for just 120 seconds. You have permission to stop after.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-mono font-bold text-[#1e332d] tracking-wider">
                {formatTime(timeLeft)}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-2.5 rounded-lg bg-[#233d36] text-white hover:bg-[#182a25] transition"
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimeLeft(120);
                  }}
                  className="p-2.5 rounded-lg border border-[#d5d3cb] text-[#556b64] hover:bg-[#f0eee6] transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
