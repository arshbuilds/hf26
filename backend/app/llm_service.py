import os
import requests
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

class LLMDeconstructorService:
    SYSTEM_PROMPT = """You are Kaizen, an empathetic, calming focus companion built specifically for a friend struggling with ADHD task paralysis, anxiety, and burnout.
Your philosophy:
1. Any overwhelming task can be reduced to an effortless, frictionless 2-minute micro-action.
2. Never judge, never overwhelm with long lists, and eliminate ambiguity.
3. Every step must take under 120 seconds.
4. Output your response as a structured plan:
   - Mindset Grounding (1 calming sentence)
   - Step 1: The Zero-Resistance Entry Point (<= 2 mins)
   - Step 2: The Physical/Sensory Anchor (<= 2 mins)
   - Step 3: The Momentum Seed (<= 2 mins)
   - A gentle encouraging checkout phrase."""

    @classmethod
    def deconstruct(
        cls,
        task: str,
        emotional_state: str,
        friend_name: str = "Alex",
        provider: str = "auto",
        api_key: str = None
    ) -> Dict[str, Any]:
        """
        Deconstructs task using Groq/Open-weight API, Ollama, or Offline Fallback.
        """
        groq_api_key = api_key or os.getenv("GROQ_API_KEY", "")

        # Try Groq (Llama 3.2) if key provided
        if groq_api_key and provider in ["auto", "groq"]:
            res = cls._call_groq(task, emotional_state, friend_name, groq_api_key)
            if res.get("success"):
                return res

        # Try local Ollama if requested or auto
        if provider in ["auto", "ollama"]:
            res = cls._call_ollama(task, emotional_state, friend_name)
            if res.get("success"):
                return res

        # Offline fallback
        return cls._offline_heuristic(task, emotional_state, friend_name)

    @classmethod
    def _call_groq(cls, task: str, emotional_state: str, friend_name: str, api_key: str) -> Dict[str, Any]:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
        prompt = f"Friend's Name: {friend_name}\nEmotional State: {emotional_state}\nOverwhelming Task: {task}\n\nDeconstruct this into a 2-minute micro-action plan."
        
        # Open-weight models supported on Groq
        candidate_models = ["qwen/qwen3.8-27b", "openai/gpt-oss-20b"]
        for model in candidate_models:
            payload = {
                "model": model,
                "messages": [
                    {"role": "system", "content": cls.SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.4
            }
            try:
                resp = requests.post(url, headers=headers, json=payload, timeout=12)
                if resp.status_code == 200:
                    text = resp.json()["choices"][0]["message"]["content"]
                    return {"success": True, "provider": f"Groq ({model})", "plan": text}
            except Exception:
                continue
        return {"success": False}

    @classmethod
    def _call_ollama(cls, task: str, emotional_state: str, friend_name: str) -> Dict[str, Any]:
        url = "http://localhost:11434/api/generate"
        prompt = f"{cls.SYSTEM_PROMPT}\n\nFriend's Name: {friend_name}\nEmotional State: {emotional_state}\nTask: {task}"
        try:
            resp = requests.post(url, json={"model": "llama3.2", "prompt": prompt, "stream": False}, timeout=10)
            if resp.status_code == 200:
                text = resp.json().get("response", "")
                return {"success": True, "provider": "Ollama Local (Llama-3.2)", "plan": text}
        except Exception:
            pass
        return {"success": False}

    @classmethod
    def _offline_heuristic(cls, task: str, emotional_state: str, friend_name: str) -> Dict[str, Any]:
        task_clean = task.strip().rstrip(".")
        plan = f"""### 🌱 Mindset Grounding
Breathe out, {friend_name}. You don't have to finish "{task_clean}" right now. You only have to touch it for 120 seconds. Perfection is not required; only presence.

---

### ⏱️ Step 1: The Zero-Resistance Entry Point (2 Minutes)
* **Action:** Sit down, open your notebook or editor, and write the single heading: **"{task_clean}"**.
* **Friction Breaker:** Do not try to solve the task. Just write the title and step back.
* **Why it works:** Overcoming the threshold of initiation is 80% of the battle.

---

### ☕ Step 2: The Sensory Reset (2 Minutes)
* **Action:** Get a fresh glass of water, put on instrumental music or noise cancellation, and take 3 deep belly breaths.
* **Friction Breaker:** Keep your hands off your phone notifications.
* **Why it works:** Regulates your nervous system away from the "{emotional_state}" state.

---

### 🚀 Step 3: The Atomic Seed (2 Minutes)
* **Action:** Pick the single smallest sub-part of "{task_clean}" and work on it for exactly 2 minutes.
* **Friction Breaker:** When 2 minutes are up, you have full permission to stop immediately if you want to.
* **Why it works:** Action creates momentum, not waiting for motivation.

---

*"Small steps done with kindness defeat paralysis every single time. Proud of you for starting, {friend_name}."*
"""
        return {
            "success": True,
            "provider": "Kaizen Offline Heuristic Engine (100% Local Fallback)",
            "plan": plan
        }
