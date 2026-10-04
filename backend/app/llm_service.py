import os
import json
import requests
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

class LLMDeconstructorService:
    SYSTEM_PROMPT = """You are Kaizen, an empathetic, calming focus companion built specifically for a friend (Siddharth) struggling with diagnosed anxiety, sensory overwhelm, and ADHD task paralysis.

Philosophy & Architecture:
1. When living with diagnosed anxiety, a big to-do list triggers an acute amygdala freeze response, treating open tasks as existential threats.
2. We dissolve paralysis through a structured Multi-Phase Progression that calms the nervous system before demanding cognition:
   - Phase 1: Zero-Resistance Ignition (1-2 steps, <= 2 minutes each): Pure physical or environmental initiation with laughably low effort to break the activation energy barrier and down-regulate panic.
   - Phase 2: Core Momentum Milestones (2-4 sequenced steps, 5 to 15 minutes each): Meaningful, concrete chunks that actually tackle the subject matter progressively without triggering perfectionism or cognitive overload.
   - Phase 3: Clean Wrap-Up Landing (1 step, 2 to 5 minutes): Low-friction closure, bookmarking where they stopped so they never lose context, and guilt-free celebration.

You MUST respond strictly with a valid JSON object matching this schema:
{
  "mindset_grounding": "1-2 calming sentences speaking directly to Siddharth to soothe his nervous system and lower cortisol",
  "steps": [
    {
      "id": "1",
      "phase": "activation",
      "phase_label": "Phase 1: Zero-Resistance Ignition",
      "title": "Title of micro-step",
      "duration_minutes": 2,
      "instruction": "Concrete, zero-ambiguity action instructions",
      "friction_breaker": "Rule to silence perfectionism or anxiety-driven overthinking",
      "why_it_works": "Neurodivergent and anxiety-informed behavioral rationale"
    }
  ],
  "encouragement": "Warm, authentic sign-off sentence celebrating the courage to start"
}

Phase values must strictly be one of: "activation", "momentum", "landing".
"""

    @classmethod
    def deconstruct(
        cls,
        task: str,
        emotional_state: str,
        friend_name: str = "Siddharth",
        provider: str = "auto",
        api_key: str = None
    ) -> Dict[str, Any]:
        """
        Deconstructs task into a Multi-Phase Progression using Groq/Open-weight API, Ollama, or Offline Fallback.
        """
        groq_api_key = api_key or os.getenv("GROQ_API_KEY", "")

        # 1. Try Groq (Qwen 3.8 / GPT-OSS) if key available
        if groq_api_key and provider in ["auto", "groq"]:
            res = cls._call_groq(task, emotional_state, friend_name, groq_api_key)
            if res.get("success"):
                return res

        # 2. Try local Ollama if requested or auto
        if provider in ["auto", "ollama"]:
            res = cls._call_ollama(task, emotional_state, friend_name)
            if res.get("success"):
                return res

        # 3. Offline heuristic fallback
        return cls._offline_heuristic(task, emotional_state, friend_name)

    @classmethod
    def _call_groq(cls, task: str, emotional_state: str, friend_name: str, api_key: str) -> Dict[str, Any]:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
        prompt = (
            f"Friend's Name: {friend_name}\n"
            f"Current Emotional State: {emotional_state}\n"
            f"Overwhelming Task: {task}\n\n"
            f"Deconstruct this into the complete Multi-Phase Progression JSON."
        )

        candidate_models = ["qwen/qwen3.8-27b", "openai/gpt-oss-20b"]
        for model in candidate_models:
            payload = {
                "model": model,
                "response_format": {"type": "json_object"},
                "messages": [
                    {"role": "system", "content": cls.SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3
            }
            try:
                resp = requests.post(url, headers=headers, json=payload, timeout=15)
                if resp.status_code == 200:
                    data = json.loads(resp.json()["choices"][0]["message"]["content"])
                    steps = data.get("steps", [])
                    grounding = data.get("mindset_grounding", "")
                    encouragement = data.get("encouragement", "")

                    # Generate markdown fallback string for export or compatibility
                    markdown_plan = cls._render_markdown_plan(grounding, steps, encouragement, friend_name)

                    return {
                        "success": True,
                        "provider": f"Groq ({model})",
                        "mindset_grounding": grounding,
                        "steps": steps,
                        "encouragement": encouragement,
                        "plan": markdown_plan
                    }
            except Exception:
                continue

        return {"success": False}

    @classmethod
    def _call_ollama(cls, task: str, emotional_state: str, friend_name: str) -> Dict[str, Any]:
        url = "http://localhost:11434/api/generate"
        prompt = f"{cls.SYSTEM_PROMPT}\n\nFriend's Name: {friend_name}\nEmotional State: {emotional_state}\nTask: {task}"
        try:
            resp = requests.post(
                url,
                json={"model": "llama3.2", "prompt": prompt, "format": "json", "stream": False},
                timeout=12
            )
            if resp.status_code == 200:
                raw = resp.json().get("response", "")
                data = json.loads(raw)
                steps = data.get("steps", [])
                grounding = data.get("mindset_grounding", "")
                encouragement = data.get("encouragement", "")
                markdown_plan = cls._render_markdown_plan(grounding, steps, encouragement, friend_name)
                return {
                    "success": True,
                    "provider": "Ollama Local (Llama-3.2)",
                    "mindset_grounding": grounding,
                    "steps": steps,
                    "encouragement": encouragement,
                    "plan": markdown_plan
                }
        except Exception:
            pass
        return {"success": False}

    @classmethod
    def _offline_heuristic(cls, task: str, emotional_state: str, friend_name: str) -> Dict[str, Any]:
        task_clean = task.strip().rstrip(".")
        grounding = (
            f"Breathe out, {friend_name}. You don't have to conquer all of \"{task_clean}\" in one go. "
            f"Perfection is not required; only presence. We break this down into bite-sized momentum blocks."
        )

        steps: List[Dict[str, Any]] = [
            {
                "id": "1",
                "phase": "activation",
                "phase_label": "Phase 1: Zero-Resistance Ignition",
                "title": "Clear the Runway & Title Setup",
                "duration_minutes": 2,
                "instruction": f"Sit down, close background distractions, open your editor or workspace, and type the single heading: \"{task_clean}\".",
                "friction_breaker": "Do not attempt to solve it yet. Just write the title and step back.",
                "why_it_works": "Lowering initiation threshold eliminates 80% of executive dysfunction."
            },
            {
                "id": "2",
                "phase": "activation",
                "phase_label": "Phase 1: Zero-Resistance Ignition",
                "title": "Sensory Reset & Anchor",
                "duration_minutes": 2,
                "instruction": "Pour a fresh glass of water, put on calm noise cancellation or instrumental music, and take 3 deep belly breaths.",
                "friction_breaker": "Keep your hands off phone notifications during these 120 seconds.",
                "why_it_works": f"Regulates the nervous system away from the \"{emotional_state}\" stress response."
            },
            {
                "id": "3",
                "phase": "momentum",
                "phase_label": "Phase 2: Core Momentum Milestone",
                "title": "Skeleton Map (3 Sub-Components)",
                "duration_minutes": 5,
                "instruction": f"Jot down 3 quick bullet points representing the absolute easiest parts of \"{task_clean}\".",
                "friction_breaker": "Zero formatting, zero grammar checks. Ugly rough notes are completely welcome.",
                "why_it_works": "Externalizing thoughts onto paper frees working memory."
            },
            {
                "id": "4",
                "phase": "momentum",
                "phase_label": "Phase 2: Core Momentum Milestone",
                "title": "First Focused Execution Sprint",
                "duration_minutes": 10,
                "instruction": "Pick the first bullet point from your skeleton and work on it with total focus until the timer expires.",
                "friction_breaker": "When the timer rings, you have full permission to pause or stop if you want.",
                "why_it_works": "Time-boxing removes the fear of open-ended, endless effort."
            },
            {
                "id": "5",
                "phase": "landing",
                "phase_label": "Phase 3: Clean Wrap-Up Landing",
                "title": "Bookmark Progress & Dopamine Checkpoint",
                "duration_minutes": 3,
                "instruction": "Write a 1-sentence note on exactly what to do next time, save your work, and stand up to stretch.",
                "friction_breaker": "Do not keep pushing into burnout. A clean stop protects tomorrow's motivation.",
                "why_it_works": "Bookmarking eliminates resuming friction for future work sessions."
            }
        ]

        encouragement = f"Small steps done with kindness defeat paralysis every single time. Proud of you for showing up, {friend_name}."
        markdown_plan = cls._render_markdown_plan(grounding, steps, encouragement, friend_name)

        return {
            "success": True,
            "provider": "Kaizen Offline Heuristic Engine (100% Local Fallback)",
            "mindset_grounding": grounding,
            "steps": steps,
            "encouragement": encouragement,
            "plan": markdown_plan
        }

    @staticmethod
    def _render_markdown_plan(grounding: str, steps: List[Dict[str, Any]], encouragement: str, friend_name: str) -> str:
        lines = [
            f"### 🌱 Mindset Grounding\n{grounding}\n\n---"
        ]

        for s in steps:
            phase = s.get("phase", "momentum")
            icon = "⏱️" if phase == "activation" else ("🚀" if phase == "momentum" else "🏁")
            dur = s.get("duration_minutes", 2)
            lines.append(f"\n### {icon} {s.get('phase_label', 'Step')} — {s.get('title')} ({dur} Mins)")
            lines.append(f"* **Action:** {s.get('instruction')}")
            lines.append(f"* **Friction Breaker:** {s.get('friction_breaker')}")
            lines.append(f"* **Why it works:** {s.get('why_it_works')}\n---")

        lines.append(f"\n*\"{encouragement}\"*")
        return "\n".join(lines)
