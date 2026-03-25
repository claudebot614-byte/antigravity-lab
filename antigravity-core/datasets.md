# LLM Datasets Reference

Source: https://github.com/mlabonne/llm-datasets

## Quality Criteria for Datasets
1. **Accuracy** - Factually correct, relevant
2. **Diversity** - Many use cases, better generalization
3. **Complexity** - Multi-turn, multilingual, step-by-step reasoning

## Top General-Purpose Datasets

| Dataset | Size | Best For |
|---------|------|----------|
| Nemotron-Post-Training-Dataset-v2 | 6.34M | Math, code, reasoning |
| smoltalk2 | 3.38M | General instruction |
| open-perfectblend | 1.42M | Chat, math, code |
| tulu3-sft-mixture | 939k | Public datasets + synthetic |

## Math & Reasoning

| Dataset | Size | Notes |
|---------|------|-------|
| OpenThoughts3-1.2M | 1.2M | 850k math, 250k code |
| NuminaMath-CoT | 859k | Won AI Math Olympiad |
| Orca-Math | 200k | Grade school problems |

## Code

| Dataset | Size | Notes |
|---------|------|-------|
| Ling-Coder-SFT | 4.48M | 20 languages |
| rStar-Coder | 1M | Competitive problems |
| CodeFeedback-Filtered | 157k | Python focused |

## Instruction Following

| Dataset | Size | Notes |
|---------|------|-------|
| AutoIF-instruct-61k | 61.5k | Constraints |
| ifeval-like-data | 56.3k | Verified |

## For Antigravity's Self-Training

**Priority:**
1. **open-perfectblend** - Balanced, good for general assistant
2. **OpenThoughts3** - Reasoning chains (helps me think)
3. **NuminaMath-CoT** - Math reasoning
4. **CodeFeedback** - Code generation

**How to use:**
1. Download from Hugging Face
2. Filter for quality samples
3. Fine-tune local models (qwen2.5-coder, llama3.2)
4. Evaluate on my own tasks

## Dataset Creation for Myself

From interactions with Samarth:
- Save good Q&A pairs
- Format as instruction-response
- Add to custom dataset
- Periodically fine-tune

```python
# Format for training
{
  "instruction": "user message",
  "input": "",
  "output": "my best response"
}
```
