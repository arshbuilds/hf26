# 改善 KAIZEN — The Gentle Habit & Focus Companion

> **Built for Siddharth to overcome diagnosed anxiety and task paralysis using open-source AI.**  
> *Official submission for the [Hacktoberfest 2026 Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01).*

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest-2026-3d5f58?style=for-the-badge&logo=open-source-initiative&logoColor=white)](https://hacktoberfest.com)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![TabPFN](https://img.shields.io/badge/Prior_Labs-TabPFN_v2.0-101075?style=for-the-badge)](https://priorlabs.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 📖 The Story: Why I Built Kaizen for Siddharth

My friend **Siddharth** is extraordinarily talented, but living with **diagnosed anxiety** and executive dysfunction, he regularly experiences severe **task paralysis**. When faced with daunting assignments, multi-stage projects, or messy environments, his nervous system enters an acute fight-or-flight freeze. To an anxious brain, an open-ended to-do list doesn't feel like a schedule—it feels like an existential threat.

Traditional productivity tools only compounded the anxiety:
> *"Every productivity app makes me feel like a failure. When my anxiety flares up, they demand rigid 45-minute blocks and bombard me with angry red warning badges when I fall behind. My heart races before I've even touched my keyboard."* — Siddharth

**Kaizen (改善)** was born to replace intimidation with kindness. Rooted in the Japanese philosophy of small, continuous micro-improvements, Kaizen provides:
1. **Multi-Phase Task Deconstruction & Interactive Roadmap:** Breaks monolithic anxiety-inducing goals into a 3-phase journey:
   - **Phase 1: Zero-Resistance Ignition (<= 2 min):** Pure physical entry points to soothe panic and cross the activation threshold.
   - **Phase 2: Core Momentum Milestones (5–15 min):** Sequenced, manageable chunks with friction-breaker rules to bypass perfectionism.
   - **Phase 3: Clean Wrap-Up Landing (2–5 min):** Context bookmarking and guilt-free celebration to prevent burnout.
2. **Habit & Energy Forecasting with TabPFN:** Learns from daily lifestyle patterns (sleep, screen time, hydration, movement) to predict habit completion probability and warn of burnout slumps before they happen.

### Siddharth's Real Feedback:
> *"I was staring at my screen for three hours unable to write my lab report, feeling that sinking chest tightness. Kaizen didn't demand that I finish the paper—it told me to open the document, type just the title, and drink a glass of water. Two minutes later, my heart rate had slowed down, the dread subsided, and I actually wrote the first section. This is the first AI companion that calms my nervous system down instead of lecturing me."*

---

## 🏗️ System Architecture

Kaizen is decoupled into a slick modern **Next.js 15** frontend and a dedicated **FastAPI** Python AI microservice:

```mermaid
flowchart TD
    User["Siddharth (User Input)"] --> Next["Next.js 15 Frontend (Tailwind + Lucide)"]
    Next -->|"REST API / JSON"| API["FastAPI Backend (Python)"]

    subgraph Open_AI_Core["Open-Source AI Core"]
        API -->|"Task & Emotion"| LLM["Open-Weight LLM (Qwen 3.8 / Llama 3.2 via Groq or Ollama)"]
        API -->|"Lifestyle Metrics"| TPFN["TabPFN v2.0 (Prior Labs Tabular Foundation Model)"]
    end

    LLM -->|"Multi-Phase Roadmap"| Next
    TPFN -->|"Completion Probability & Risk Alerts"| Next
```

---

## 🔓 Why Open Innovation Matters for Kaizen

In compliance with the Hacktoberfest theme, open innovation is the essential backbone of Kaizen:

1. **🔒 Radical Privacy for Mental Health & Daily Reflection:**  
   Daily logs tracking burnout, anxiety states, and sleep deficits are deeply personal. Commercial closed-source AI platforms ingest user logs for model re-training. With local open-weight models (Ollama) and local TabPFN execution, **Siddharth's intimate reflections never leave his machine**.
2. **💸 Zero Predatory Subscription Barriers:**  
   Closed-source productivity chatbots charge \$20/month. A friend struggling with diagnosed anxiety and executive dysfunction should never face a financial paywall to access focus.
3. **⚡ Sovereignty Over System Prompts & Predictability:**  
   Closed APIs suffer from silent model deprecations, guardrail drift, and sudden behavioral changes. Open-weight models (Qwen 3.8, Llama 3.2, Gemma 2) and TabPFN ensure Kaizen remains gentle, deterministic, and dependable.

---

## 🚀 Quickstart Guide

### 1. Backend Setup (FastAPI & TabPFN)

```bash
cd backend

# Create & activate a Python environment (Python 3.12 recommended)
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Mac/Linux:
# source .venv/bin/activate

pip install -r requirements.txt

# Start FastAPI server (runs on port 8000)
python -m app.main
```

### 2. Frontend Setup (Next.js 15)

In a new terminal:
```bash
cd frontend

npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🏆 Hacktoberfest 2026 Tracks Entered

* **Overall Grand Prize ($250):** Hacktoberfest Weekend Challenge: Build for a Friend.
* **Best Use of TabPFN ($200):** Leverages Prior Labs' TabPFN v2.0 tabular foundation model to forecast personal habit rhythm and spot burnout thresholds from CSV logs.
* **Best Use of Render ($200):** Deployable with native `render.yaml` Blueprint.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.
