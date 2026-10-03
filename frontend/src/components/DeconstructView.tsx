"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  Flame,
  Rocket,
  Flag,
  Lightbulb,
  Copy,
  Check,
  FileText,
  Clock,
  ShieldCheck,
  Brain,
  Zap,
} from "lucide-react";

interface StepItem {
  id: string;
  phase: "activation" | "momentum" | "landing" | string;
  phase_label: string;
  title: string;
  duration_minutes: number;
  instruction: string;
  friction_breaker: string;
  why_it_works: string;
}

interface DeconstructResult {
  success: boolean;
  provider: string;
  mindset_grounding: string;
  steps: StepItem[];
  encouragement: string;
  plan: string;
}

interface DeconstructViewProps {
  friendName: string;
}

export default function DeconstructView({ friendName }: DeconstructViewProps) {
  const [task, setTask] = useState("Study 4 chapters of Distributed Systems and clean my chaotic desk");
  const [emotion, setEmotion] = useState("Task Paralysis");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DeconstructResult | null>(null);
  const [viewRawMarkdown, setViewRawMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);

  // Step interaction state
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerInitialDuration, setTimerInitialDuration] = useState(120);

  // Timer interval
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
    setCompletedSteps(new Set());
    setActiveStepId(null);
    setIsTimerRunning(false);

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
        const data: DeconstructResult = await res.json();
        setResult(data);
        if (data.steps && data.steps.length > 0) {
          const firstStep = data.steps[0];
          setActiveStepId(firstStep.id);
          const dur = (firstStep.duration_minutes || 2) * 60;
          setTimeLeft(dur);
          setTimerInitialDuration(dur);
        }
      } else {
        throw new Error("Backend response error");
      }
    } catch {
      // Offline fallback plan with rich multi-phase steps
      const fallbackResult: DeconstructResult = {
        success: true,
        provider: "Kaizen Offline Heuristic Engine (Local Fallback)",
        mindset_grounding: `Breathe out, ${friendName}. You don't have to conquer "${task}" today. Perfection is not required; only presence. We break this down into bite-sized momentum blocks.`,
        steps: [
          {
            id: "1",
            phase: "activation",
            phase_label: "Phase 1: Zero-Resistance Ignition",
            title: "Clear the Runway & Title Setup",
            duration_minutes: 2,
            instruction: `Sit down, close distracting tabs, open your workspace, and write the single title: "${task}".`,
            friction_breaker: "Do not attempt to solve it yet. Just write the title and step back.",
            why_it_works: "Overcoming the physical initiation threshold resolves 80% of executive dysfunction.",
          },
          {
            id: "2",
            phase: "activation",
            phase_label: "Phase 1: Zero-Resistance Ignition",
            title: "Sensory Reset & Anchor",
            duration_minutes: 2,
            instruction: "Pour a fresh glass of water, put on calm noise cancellation or instrumental music, and take 3 deep belly breaths.",
            friction_breaker: "Keep your hands off notifications during these 120 seconds.",
            why_it_works: `Regulates the nervous system away from the "${emotion}" stress response.`,
          },
          {
            id: "3",
            phase: "momentum",
            phase_label: "Phase 2: Core Momentum Milestone",
            title: "Skeleton Map (3 Sub-Components)",
            duration_minutes: 5,
            instruction: `Jot down 3 quick bullet points representing the absolute easiest parts of "${task}".`,
            friction_breaker: "Zero formatting, zero grammar checks. Ugly rough notes are completely welcome.",
            why_it_works: "Externalizing thoughts onto paper frees working memory.",
          },
          {
            id: "4",
            phase: "momentum",
            phase_label: "Phase 2: Core Momentum Milestone",
            title: "First Focused Execution Sprint",
            duration_minutes: 10,
            instruction: "Pick the single easiest bullet point from your skeleton and work on it with total focus until the timer rings.",
            friction_breaker: "When the timer rings, you have full permission to pause or stop if you want.",
            why_it_works: "Time-boxing removes the fear of open-ended, endless effort.",
          },
          {
            id: "5",
            phase: "landing",
            phase_label: "Phase 3: Clean Wrap-Up Landing",
            title: "Bookmark Progress & Dopamine Checkpoint",
            duration_minutes: 3,
            instruction: "Write a 1-sentence note on exactly what to do next time, save your work, and stand up to stretch.",
            friction_breaker: "Do not keep pushing into burnout. A clean stop protects tomorrow's motivation.",
            why_it_works: "Bookmarking eliminates resuming friction for future work sessions.",
          },
        ],
        encouragement: `Small steps done with kindness defeat paralysis every single time. Proud of you for showing up, ${friendName}.`,
        plan: `### 🌱 Mindset Grounding\nBreathe out, ${friendName}...\n\n### ⏱️ Phase 1: Ignition\n...`,
      };

      setResult(fallbackResult);
      if (fallbackResult.steps.length > 0) {
        setActiveStepId(fallbackResult.steps[0].id);
        const dur = (fallbackResult.steps[0].duration_minutes || 2) * 60;
        setTimeLeft(dur);
        setTimerInitialDuration(dur);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleStepCompleted = (stepId: string) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(stepId)) {
        next.delete(stepId);
      } else {
        next.add(stepId);
      }
      return next;
    });
  };

  const handleStartStepTimer = (step: StepItem) => {
    setActiveStepId(step.id);
    const seconds = (step.duration_minutes || 2) * 60;
    setTimeLeft(seconds);
    setTimerInitialDuration(seconds);
    setIsTimerRunning(true);
  };

  const handleCopyMarkdown = () => {
    if (!result) return;
    const textToCopy = result.plan || `${result.mindset_grounding}\n\n${result.steps.map(s => `- [ ] ${s.title}: ${s.instruction}`).join("\n")}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeStep = useMemo(() => {
    if (!result || !result.steps) return null;
    return result.steps.find((s) => s.id === activeStepId) || result.steps[0];
  }, [result, activeStepId]);

  const totalEstimatedMinutes = useMemo(() => {
    if (!result?.steps) return 0;
    return result.steps.reduce((acc, s) => acc + (s.duration_minutes || 2), 0);
  }, [result]);

  const progressPercentage = useMemo(() => {
    if (!result?.steps || result.steps.length === 0) return 0;
    return Math.round((completedSteps.size / result.steps.length) * 100);
  }, [result, completedSteps]);

  // Phase badge styles & icons
  const getPhaseMeta = (phase: string) => {
    switch (phase.toLowerCase()) {
      case "activation":
        return {
          icon: <Flame className="w-4 h-4 text-emerald-600" />,
          pillBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
          cardBorder: "hover:border-emerald-300",
          name: "Phase 1: Zero-Resistance Ignition",
          badgeColor: "bg-emerald-100 text-emerald-800",
        };
      case "momentum":
        return {
          icon: <Rocket className="w-4 h-4 text-amber-600" />,
          pillBg: "bg-amber-50 text-amber-800 border-amber-200",
          cardBorder: "hover:border-amber-300",
          name: "Phase 2: Core Momentum Milestones",
          badgeColor: "bg-amber-100 text-amber-800",
        };
      case "landing":
      default:
        return {
          icon: <Flag className="w-4 h-4 text-purple-600" />,
          pillBg: "bg-purple-50 text-purple-800 border-purple-200",
          cardBorder: "hover:border-purple-300",
          name: "Phase 3: Clean Wrap-Up Landing",
          badgeColor: "bg-purple-100 text-purple-800",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Form Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#e7e5de] shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-[#ecfdf5] text-[#059669]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1e332d]">Multi-Phase Task Deconstruction</h2>
            <p className="text-sm text-[#556b64]">
              Transform paralyzing boulders into sequenced, zero-friction progression checkpoints for {friendName}.
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
              placeholder="e.g. Study 4 chapters of Distributed Systems, fix messy room, file taxes..."
              className="w-full px-4 py-3 rounded-xl border border-[#d5d3cb] bg-[#faf9f5] text-[#1e332d] focus:outline-none focus:ring-2 focus:ring-[#233d36]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#556b64] uppercase tracking-wider">
              Current Emotional State
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
              <option value="Perfectionism Dread">Perfectionism Dread</option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={handleDeconstruct}
            disabled={loading || !task.trim()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#233d36] text-white font-medium hover:bg-[#182a25] transition-all disabled:opacity-50 cursor-pointer shadow-sm hover:shadow"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? "Deconstructing into Progression..." : "Deconstruct Task with Kaizen"}
          </button>
        </div>
      </div>

      {/* Structured Results Display */}
      {result && (
        <div className="space-y-6">
          {/* Top Bar with Provider & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e7e5de]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#059669] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Tailored Roadmap for {friendName}
              </span>
              <span className="text-xs text-[#60726d] bg-[#f4f2ea] px-3 py-1 rounded-full border border-[#e5e3db]">
                Engine: {result.provider}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                className="flex items-center gap-1.5 text-xs text-[#556b64] hover:text-[#1e332d] bg-[#faf9f5] px-3 py-1.5 rounded-lg border border-[#e0ded6] transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Markdown"}
              </button>
              <button
                onClick={() => setViewRawMarkdown(!viewRawMarkdown)}
                className="flex items-center gap-1.5 text-xs text-[#556b64] hover:text-[#1e332d] bg-[#faf9f5] px-3 py-1.5 rounded-lg border border-[#e0ded6] transition"
              >
                <FileText className="w-3.5 h-3.5" />
                {viewRawMarkdown ? "Show Card View" : "View Raw Markdown"}
              </button>
            </div>
          </div>

          {/* Mindset Grounding Card */}
          {result.mindset_grounding && (
            <div className="bg-gradient-to-r from-[#ecfdf5] to-[#f0fdf4] border border-[#a7f3d0] rounded-2xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 mt-0.5">
                  <Brain className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    Mindset Grounding
                  </h3>
                  <p className="text-sm md:text-base text-emerald-950 leading-relaxed font-medium">
                    {result.mindset_grounding}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Raw Markdown Fallback View */}
          {viewRawMarkdown ? (
            <div className="bg-white rounded-2xl p-6 border border-[#e7e5de] shadow-sm">
              <div className="prose max-w-none text-[#2d453e] whitespace-pre-line leading-relaxed text-sm md:text-base">
                {result.plan}
              </div>
            </div>
          ) : (
            /* Rich Multi-Phase Step Cards View */
            <div className="space-y-6">
              {/* Progress & Overview Bar */}
              <div className="bg-white rounded-2xl p-4 border border-[#e7e5de] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-[#344d44] font-semibold">
                    <Clock className="w-4 h-4 text-[#556b64]" />
                    <span>Est. Total Time: ~{totalEstimatedMinutes} mins</span>
                  </div>
                  <span className="text-[#d5d3cb]">|</span>
                  <div className="text-sm text-[#556b64]">
                    Completed: <span className="font-bold text-[#1e332d]">{completedSteps.size}</span> of{" "}
                    {result.steps?.length || 0} checkpoints
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-48">
                  <div className="w-full bg-[#f0eee6] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[#059669] h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold font-mono text-[#1e332d]">
                    {progressPercentage}%
                  </span>
                </div>
              </div>

              {/* Active Step Companion Timer Banner */}
              {activeStep && (
                <div className="bg-[#1e332d] text-white rounded-2xl p-5 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-white/10 text-emerald-400">
                      <Timer className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
                          Active Focus Step
                        </span>
                        <span className="text-xs text-white/60">
                          ({activeStep.duration_minutes} Mins Target)
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white line-clamp-1">
                        {activeStep.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="text-3xl md:text-4xl font-mono font-bold tracking-wider text-emerald-300">
                      {formatTime(timeLeft)}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className="p-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition flex items-center gap-2 font-medium cursor-pointer"
                        title={isTimerRunning ? "Pause Timer" : "Start Timer"}
                      >
                        {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        <span className="text-sm font-semibold">{isTimerRunning ? "Pause" : "Focus"}</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsTimerRunning(false);
                          setTimeLeft(timerInitialDuration);
                        }}
                        className="p-3 rounded-xl bg-white/10 text-white/80 hover:bg-white/20 transition cursor-pointer"
                        title="Reset Timer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      {!completedSteps.has(activeStep.id) && (
                        <button
                          onClick={() => toggleStepCompleted(activeStep.id)}
                          className="px-3.5 py-2.5 rounded-xl bg-white/10 text-emerald-300 hover:bg-emerald-900/50 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* The Step Cards List */}
              <div className="space-y-4">
                {result.steps?.map((step, idx) => {
                  const meta = getPhaseMeta(step.phase || "");
                  const isDone = completedSteps.has(step.id);
                  const isActive = activeStepId === step.id;

                  return (
                    <div
                      key={step.id || idx}
                      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                        isActive
                          ? "border-[#059669] ring-2 ring-[#059669]/20"
                          : isDone
                          ? "border-[#e0ded6] bg-[#fbfbfa]"
                          : "border-[#e7e5de] hover:border-[#ccd4d0]"
                      }`}
                    >
                      {/* Step Header */}
                      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f3f2ec]">
                        <div className="flex items-center gap-3">
                          {/* Toggle Checkbox */}
                          <button
                            onClick={() => toggleStepCompleted(step.id)}
                            className="cursor-pointer text-[#556b64] hover:text-[#059669] transition"
                            title={isDone ? "Mark incomplete" : "Mark completed"}
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-6 h-6 text-[#059669] fill-[#ecfdf5]" />
                            ) : (
                              <Circle className="w-6 h-6 text-[#b5b3a9] hover:text-[#059669]" />
                            )}
                          </button>

                          {/* Phase Pill & Step Number */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${meta.pillBg}`}
                            >
                              {meta.icon}
                              {step.phase_label || meta.name}
                            </span>
                            <span className="text-xs text-[#87857c] font-medium">
                              Step {idx + 1}
                            </span>
                          </div>
                        </div>

                        {/* Right side: Duration & Start Timer */}
                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <span className="text-xs font-mono font-medium text-[#556b64] bg-[#f5f4ee] px-2.5 py-1 rounded-lg border border-[#e5e3db] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[#73857e]" />
                            {step.duration_minutes} min
                          </span>

                          <button
                            onClick={() => handleStartStepTimer(step)}
                            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer ${
                              isActive && isTimerRunning
                                ? "bg-emerald-600 text-white"
                                : "bg-[#233d36] text-white hover:bg-[#182a25]"
                            }`}
                          >
                            {isActive && isTimerRunning ? (
                              <>
                                <Pause className="w-3.5 h-3.5" />
                                <span>Running</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5" />
                                <span>Focus This</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Step Body */}
                      <div className="p-5 space-y-4">
                        <div>
                          <h4
                            className={`text-base md:text-lg font-bold ${
                              isDone ? "line-through text-[#87857c]" : "text-[#1e332d]"
                            }`}
                          >
                            {step.title}
                          </h4>
                          <p
                            className={`mt-1.5 text-sm md:text-base leading-relaxed ${
                              isDone ? "text-[#87857c]" : "text-[#344d44]"
                            }`}
                          >
                            {step.instruction}
                          </p>
                        </div>

                        {/* Friction Breaker Box */}
                        {step.friction_breaker && (
                          <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-xl p-3.5 flex items-start gap-2.5">
                            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div className="text-xs md:text-sm text-amber-950">
                              <span className="font-bold text-amber-900">Friction Breaker: </span>
                              {step.friction_breaker}
                            </div>
                          </div>
                        )}

                        {/* Why It Works Box */}
                        {step.why_it_works && (
                          <div className="bg-[#faf9f5] border border-[#f0eee6] rounded-xl p-3 flex items-start gap-2 text-xs text-[#556b64]">
                            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-[#1e332d]">Why this works: </span>
                              {step.why_it_works}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Encouragement Footer Card */}
              {result.encouragement && (
                <div className="bg-white rounded-2xl p-5 border border-[#e7e5de] text-center space-y-2 shadow-sm">
                  <p className="text-sm md:text-base italic text-[#233d36] font-medium">
                    &ldquo;{result.encouragement}&rdquo;
                  </p>
                  <p className="text-xs text-[#87857c]">
                    Kaizen for {friendName} • Hacktoberfest 2026 Weekend Challenge
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
