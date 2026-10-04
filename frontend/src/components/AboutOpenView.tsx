"use client";

import React from "react";
import { ShieldCheck, Heart, Cpu, DollarSign, Award, ArrowUpRight } from "lucide-react";

interface AboutOpenViewProps {
  friendName: string;
}

export default function AboutOpenView({ friendName }: AboutOpenViewProps) {
  return (
    <div className="space-y-6">
      {/* Story Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#e7e5de] shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#059669] uppercase tracking-wider">
          <Heart className="w-4 h-4" />
          The Story Behind Kaizen
        </div>

        <h3 className="text-2xl font-bold text-[#1e332d]">
          Built for {friendName}: Overcoming Diagnosed Anxiety & Task Paralysis with Open AI
        </h3>

        <div className="space-y-3 text-[#334b44] text-sm md:text-base leading-relaxed">
          <p>
            My friend <strong>{friendName}</strong> is a brilliant developer and creator, but living with <strong>diagnosed anxiety</strong> and executive dysfunction, he frequently experiences severe <strong>task paralysis</strong>. When faced with large responsibilities or chaotic task lists, his nervous system enters an acute fight-or-flight freeze, making even starting a task feel like an existential dread.
          </p>

          <p>
            Conventional productivity and time-management apps only amplify that panic:
          </p>

          <blockquote className="border-l-4 border-[#059669] pl-4 italic text-[#243f37] bg-[#f7fdfa] p-3 rounded-r-xl">
            "When my anxiety flares up, a to-do list looks like a wall of threats. Traditional apps demand rigid 45-minute blocks and slap red guilt badges on missed goals. Kaizen does the opposite: it calms my nervous system down, gives me an effortless 2-minute doorway, and guides me through bite-sized momentum chunks without panic." — {friendName}
          </blockquote>

          <p>
            <strong>Kaizen (改善)</strong> replaces pressure with compassionate presence. Grounded in continuous micro-improvements, Kaizen never judges. It dissolves paralyzing boulders into sequenced, low-friction checkpoints and uses tabular machine learning to safeguard your recovery rhythm.
          </p>
        </div>
      </div>

      {/* Why Open Innovation Matters */}
      <div className="bg-white rounded-2xl p-6 border border-[#e7e5de] shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-[#1e332d]">
          Why Open Innovation Matters for Kaizen
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-[#faf9f5] border border-[#f0eee6] space-y-2">
            <div className="p-2 rounded-lg bg-[#dbeafe] text-[#1e40af] w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#1e332d]">Radical Mental Health Privacy</h4>
            <p className="text-xs text-[#556b64] leading-relaxed">
              Personal reflections on burnout, sleep deficits, and anxiety are deeply vulnerable. With local open-weight models (Ollama) and local TabPFN execution, {friendName}'s reflections never leave their machine.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#faf9f5] border border-[#f0eee6] space-y-2">
            <div className="p-2 rounded-lg bg-[#dcfce7] text-[#166534] w-fit">
              <DollarSign className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#1e332d]">Zero Predatory Paywalls</h4>
            <p className="text-xs text-[#556b64] leading-relaxed">
              Commercial productivity chatbots charge $20/month. For students battling burnout, financial friction should never stand between someone and their executive function.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#faf9f5] border border-[#f0eee6] space-y-2">
            <div className="p-2 rounded-lg bg-[#fef3c7] text-[#92400e] w-fit">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#1e332d]">Model Sovereignty & Stability</h4>
            <p className="text-xs text-[#556b64] leading-relaxed">
              Closed APIs suffer from sudden guardrail shifts and unexpected prompt deprecations. Open models (Llama 3.2, Gemma 2, TabPFN) guarantee predictable, compassionate responses every single time.
            </p>
          </div>
        </div>
      </div>

      {/* Prize Tracks Alignment */}
      <div className="bg-[#233d36] text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#a7f3d0] uppercase tracking-wider">
            <Award className="w-4 h-4" />
            Hacktoberfest 2026 Target Tracks
          </div>
          <h4 className="text-lg font-bold">Entered into Grand Prize + Best Use of TabPFN ($200)</h4>
          <p className="text-xs text-[#d1fae5] max-w-xl">
            Leveraging Prior Labs' TabPFN tabular foundation model for habit forecasting, and pre-configured with Render Blueprint for 1-click cloud deployment.
          </p>
        </div>

        <a
          href="https://dev.to/challenges/hacktoberfest-weekend-2026-10-01"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#233d36] font-semibold text-xs hover:bg-[#f0fdf4] transition shrink-0"
        >
          View Challenge Page
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
