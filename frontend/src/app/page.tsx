"use client";

import React, { useState } from "react";
import DeconstructView from "@/components/DeconstructView";
import ForecastView from "@/components/ForecastView";
import AboutOpenView from "@/components/AboutOpenView";
import { Sparkles, Activity, Heart, User, ExternalLink } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"deconstruct" | "forecast" | "about">("deconstruct");
  const [friendName, setFriendName] = useState("Siddharth");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 space-y-8">
      {/* Top Bar / Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e7e5de] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🌱</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#1e332d]">
              改善 KAIZEN
            </h1>
          </div>
          <p className="text-sm text-[#556b64]">
            The Gentle Habit & Focus Companion built for <strong>{friendName}</strong>
          </p>
        </div>

        {/* Friend Selector & Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#d5d3cb] bg-white text-xs text-[#556b64]">
            <User className="w-3.5 h-3.5" />
            <span>Building for:</span>
            <input
              type="text"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              className="w-20 font-bold text-[#1e332d] bg-transparent border-b border-dashed border-[#556b64] focus:outline-none"
            />
          </div>

          <span className="px-3 py-1.5 rounded-xl bg-[#ecfdf5] text-[#065f46] text-xs font-semibold border border-[#a7f3d0]">
            Hacktoberfest 2026
          </span>
        </div>
      </header>

      {/* Navigation Pills */}
      <div className="flex flex-wrap gap-2 border-b border-[#f0eee6] pb-3">
        <button
          onClick={() => setActiveTab("deconstruct")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
            activeTab === "deconstruct"
              ? "bg-[#233d36] text-white shadow-sm"
              : "bg-white text-[#556b64] hover:bg-[#f4f2ea] border border-[#e7e5de]"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Task Progression Roadmap
        </button>

        <button
          onClick={() => setActiveTab("forecast")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
            activeTab === "forecast"
              ? "bg-[#233d36] text-white shadow-sm"
              : "bg-white text-[#556b64] hover:bg-[#f4f2ea] border border-[#e7e5de]"
          }`}
        >
          <Activity className="w-4 h-4" />
          Habit Forecaster (TabPFN)
        </button>

        <button
          onClick={() => setActiveTab("about")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
            activeTab === "about"
              ? "bg-[#233d36] text-white shadow-sm"
              : "bg-white text-[#556b64] hover:bg-[#f4f2ea] border border-[#e7e5de]"
          }`}
        >
          <Heart className="w-4 h-4" />
          Why Open Innovation Matters
        </button>
      </div>

      {/* Active Tab View */}
      <main className="transition-all">
        {activeTab === "deconstruct" && <DeconstructView friendName={friendName} />}
        {activeTab === "forecast" && <ForecastView friendName={friendName} />}
        {activeTab === "about" && <AboutOpenView friendName={friendName} />}
      </main>

      {/* Footer */}
      <footer className="pt-8 border-t border-[#e7e5de] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71847e]">
        <div>
          <span>改善 Kaizen — Built with Open-Source AI for </span>
          <strong className="text-[#233d36]">{friendName}</strong>
          <span> • Hacktoberfest Weekend Challenge</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://dev.to/challenges/hacktoberfest-weekend-2026-10-01"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline text-[#233d36] font-medium"
          >
            <span>DEV Challenge Page</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}
