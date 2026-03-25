# Antigravity Training Pipeline

## Data Sources

### From LLMDataHub
- https://github.com/Zjh-819/LLMDataHub

**Top Datasets for Antigravity:**

| Dataset | Size | Type | Use |
|---------|------|------|-----|
| HelpSteer | 37k | RLHF | Helpful, correct responses |
| no_robots | 10k | SFT | Human-created, high quality |
| OpenOrca | 4.5M | Pairs | General reasoning |
| WizardLM_evol_instruct_V2 | 196k | Dialog | Complex instructions |
| dolphin | 4.5M | Pairs | FLAN-based |
| ultraChat | 1.57M | Dialog | Multi-turn |
| hh-rlhf | 161k | RLHF | Harmlessness + helpfulness |
| LIMA | 1k | SFT | High quality, minimal data |
| Platypus | 25k | Pairs | STEM reasoning |
| ShareGPT_Vicuna | 53k | Pairs | Real conversations |

### From awesome-RLHF
- https://github.com/opendilab/awesome-RLHF

**Key RLHF Papers & Methods:**
- DPO (Direct Preference Optimization)
- PPO (Proximal Policy Optimization)
- REINFORCE++
- RTO (Reinforced Token Optimization)
- Test-Time Preference Optimization

## Training Strategy

### Phase 1: SFT (Supervised Fine-Tuning)
1. Download high-quality SFT datasets
2. Filter for relevance (code, reasoning, helpful)
3. Fine-tune base models:
   - qwen2.5-coder:7b (code focus)
   - llama3.2:3b (general)
   - deepseek-r1:8b (reasoning)

### Phase 2: RLHF
1. Build reward model from preferences
2. Collect human feedback (Samarth corrections)
3. Apply DPO/PPO training
4. Evaluate on tasks

### Phase 3: Continuous Learning
1. Log all interactions
2. Extract good examples
3. Periodically retrain
4. Track improvement metrics

## Implementation

```bash
# Download datasets
pip install datasets
python -c "from datasets import load_dataset; ds = load_dataset('garage-bAInd/Open-Platypus')"

# Fine-tune with LoRA
pip install peft transformers accelerate
```

## My Training Data

### Auto-collected from interactions
```json
{
  "instruction": "user message",
  "input": "",
  "output": "my response",
  "quality": "good|bad",
  "timestamp": "2026-03-25T..."
}
```

### Feedback sources
- Explicit: "good", "wrong", "fix X"
- Implicit: Follow-up questions, corrections
- Behavioral: Task completion, time spent

## Metrics to Track
- Response quality (critique score)
- Task completion rate
- User satisfaction signals
- Code generation success
- Reasoning accuracy

## Tools
- **Axolotl** - Fine-tuning framework
- **OpenRLHF** - RLHF training
- **Unsloth** - Fast LoRA training
- **LLaMA-Factory** - Easy training UI
