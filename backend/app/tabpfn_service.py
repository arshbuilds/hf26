import logging
import os
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple

logger = logging.getLogger(__name__)

class TabPFNService:
    FEATURE_COLS = [
        "sleep_hours",
        "screen_time_hours",
        "water_liters",
        "caffeine_cups",
        "stress_level",
        "morning_walk_mins"
    ]
    TARGET_COL = "habit_completed"

    def __init__(self, data_path: str = None):
        if data_path is None:
            data_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "sample_habit_log.csv")
        self.data_path = data_path
        self.model = None
        self.model_name = "Uninitialized"
        self.is_tabpfn = False
        self.df = None
        self._load_and_fit()

    def _load_and_fit(self):
        try:
            if os.path.exists(self.data_path):
                self.df = pd.read_csv(self.data_path)
            else:
                self.df = pd.DataFrame({
                    "sleep_hours": [7.5, 5.0, 8.0, 5.5],
                    "screen_time_hours": [3.0, 8.0, 2.5, 7.5],
                    "water_liters": [2.5, 1.2, 3.0, 1.0],
                    "caffeine_cups": [1, 4, 1, 3],
                    "stress_level": [2, 5, 1, 4],
                    "morning_walk_mins": [30, 0, 25, 0],
                    "habit_completed": [1, 0, 1, 0]
                })

            X = self.df[self.FEATURE_COLS].values
            y = self.df[self.TARGET_COL].values.astype(int)

            try:
                from tabpfn import TabPFNClassifier
                self.model = TabPFNClassifier(device="auto", N_ensemble_configurations=8)
                self.model.fit(X, y)
                self.model_name = "TabPFN v2.0 (Prior Labs Foundation Model)"
                self.is_tabpfn = True
                logger.info("TabPFN initialized successfully.")
            except Exception as e:
                logger.warning(f"TabPFN initialization failed ({e}), falling back to Scikit-Learn RandomForest.")
                from sklearn.ensemble import RandomForestClassifier
                self.model = RandomForestClassifier(n_estimators=100, random_state=42)
                self.model.fit(X, y)
                self.model_name = "Scikit-Learn Random Forest (Baseline Fallback)"
                self.is_tabpfn = False
        except Exception as e:
            logger.error(f"Error during data load / model fit: {e}")

    def get_status(self) -> Dict[str, Any]:
        return {
            "model_name": self.model_name,
            "is_tabpfn": self.is_tabpfn,
            "data_samples_count": len(self.df) if self.df is not None else 0
        }

    def get_history(self) -> list:
        if self.df is None:
            return []
        return self.df.to_dict(orient="records")

    def forecast(self, metrics: Dict[str, float]) -> Dict[str, Any]:
        if self.model is None:
            self._load_and_fit()

        sleep = float(metrics.get("sleep_hours", 7.0))
        screen = float(metrics.get("screen_time_hours", 4.0))
        water = float(metrics.get("water_liters", 2.0))
        caffeine = int(metrics.get("caffeine_cups", 2))
        stress = int(metrics.get("stress_level", 2))
        walk = int(metrics.get("morning_walk_mins", 15))

        input_vector = np.array([[sleep, screen, water, caffeine, stress, walk]])
        probs = self.model.predict_proba(input_vector)[0]
        completion_prob = float(probs[1]) if len(probs) > 1 else float(probs[0])

        risks = []
        suggestions = []

        if sleep < 6.0:
            risks.append(f"Low Sleep ({sleep}h): High cognitive fatigue threshold.")
            suggestions.append("Tonight: Keep phone across the room 45 mins before bedtime.")
        if screen > 6.0:
            risks.append(f"High Screen Time ({screen}h): Dopamine fatigue detected.")
            suggestions.append("Apply the 20-20-20 rule and take a 5-minute outdoor break.")
        if stress >= 4:
            risks.append(f"High Stress (Level {stress}/5): Task paralysis risk elevated.")
            suggestions.append("Shift your to-do list to 2-minute micro-habits only today.")
        if walk == 0:
            risks.append("No Morning Movement: Sluggish cortisol awakening response.")
            suggestions.append("Take a simple 5-minute stretch or walk around the block.")
        if water < 1.5:
            risks.append(f"Low Hydration ({water}L): Brain fog amplifier.")
            suggestions.append("Drink a tall glass of cold water now.")

        if not risks:
            risks.append("Rhythm is balanced! Conditions are optimal for deep work.")
            suggestions.append("Ride this momentum: tackle your highest-friction task first.")

        # Simulate optimization (+1h sleep, -1.5h screen time)
        sim_improved = input_vector.copy()
        sim_improved[0][0] = min(8.5, sim_improved[0][0] + 1.0)
        sim_improved[0][1] = max(2.0, sim_improved[0][1] - 1.5)
        sim_prob = float(self.model.predict_proba(sim_improved)[0][1])

        return {
            "completion_probability": round(completion_prob * 100, 1),
            "optimized_probability": round(sim_prob * 100, 1),
            "potential_gain": round((sim_prob - completion_prob) * 100, 1),
            "model_name": self.model_name,
            "is_tabpfn": self.is_tabpfn,
            "risks": risks,
            "suggestions": suggestions
        }
