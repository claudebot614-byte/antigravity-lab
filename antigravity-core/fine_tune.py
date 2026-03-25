#!/usr/bin/env python3
"""
Fine-tuning Pipeline - Train local models on collected data

Supports:
- LoRA fine-tuning with Unsloth
- Direct training with Axolotl
- Simple distillation to smaller models
"""

import json
import os
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime


class FineTuningPipeline:
    """
    Fine-tune local models on custom data.

    Prerequisites:
    - pip install unsloth peft transformers accelerate bitsandbytes
    - OR use Ollama fine-tuning: ollama create mymodel -f Modelfile
    """

    def __init__(self, base_model: str = "unsloth/llama-3-8b-bnb-4bit"):
        self.base_model = base_model
        self.training_data_dir = Path(os.path.expanduser("~/.openclaw/workspace/training-data"))
        self.output_dir = Path(os.path.expanduser("~/.openclaw/workspace/fine-tuned"))

    def prepare_dataset(self, samples: List[Dict]) -> List[Dict]:
        """
        Prepare samples for training.

        Format:
        {
            "text": "<|user|>\n{instruction}\n<|assistant|>\n{output}"
        }
        """
        formatted = []

        for sample in samples:
            text = f"<|user|>\n{sample['instruction']}\n<|assistant|>\n{sample['output']}"
            formatted.append({"text": text})

        return formatted

    def load_training_data(self, quality_filter: List[str] = None) -> List[Dict]:
        """Load collected training data."""
        quality_filter = quality_filter or ["good", "neutral"]
        samples = []

        for file in self.training_data_dir.glob("*.jsonl"):
            with open(file) as f:
                for line in f:
                    try:
                        sample = json.loads(line)
                        if sample.get("quality") in quality_filter:
                            samples.append(sample)
                    except:
                        pass

        return samples

    def train_unsloth(
        self,
        output_name: str,
        epochs: int = 3,
        batch_size: int = 4,
        learning_rate: float = 2e-4
    ):
        """
        Train using Unsloth (fast LoRA fine-tuning).

        Requires: pip install unsloth
        """
        training_script = f'''
from unsloth import FastLanguageModel
import torch
from datasets import Dataset
from transformers import TrainingArguments
from trl import SFTTrainer

# Load base model
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="{self.base_model}",
    max_seq_length=2048,
    dtype=None,
    load_in_4bit=True,
)

# Add LoRA adapters
model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj"],
    lora_alpha=16,
    lora_dropout=0,
    bias="none",
    use_gradient_checkpointing=True,
)

# Load data
import json
samples = json.load(open("{self.training_data_dir}/prepared.json"))
dataset = Dataset.from_list(samples)

# Train
trainer = SFTTrainer(
    model=model,
    train_dataset=dataset,
    dataset_text_field="text",
    args=TrainingArguments(
        num_train_epochs={epochs},
        per_device_train_batch_size={batch_size},
        learning_rate={learning_rate},
        output_dir="{self.output_dir}/{output_name}",
        save_strategy="epoch",
    ),
)
trainer.train()

# Save
model.save_pretrained("{self.output_dir}/{output_name}")
tokenizer.save_pretrained("{self.output_dir}/{output_name}")
print("Model saved to {self.output_dir}/{output_name}")
'''

        # Save script
        script_path = self.output_dir / "train_unsloth.py"
        self.output_dir.mkdir(parents=True, exist_ok=True)

        with open(script_path, 'w') as f:
            f.write(training_script)

        print(f"Training script saved to: {script_path}")
        print(f"Run with: python {script_path}")

        return script_path

    def train_ollama_modelfile(self, output_name: str, samples: List[Dict]):
        """
        Create Ollama Modelfile for fine-tuning.

        This uses a different approach - provide examples in the Modelfile.
        """
        modelfile_lines = [
            f'FROM llama3.2:3b',
            '',
            '# System prompt',
            'SYSTEM You are Antigravity, an autonomous AI assistant. You are helpful, precise, and proactive.',
            '',
            '# Training examples',
        ]

        # Add examples (Ollama supports few-shot in Modelfile)
        for sample in samples[:20]:  # Ollame doesn't support full fine-tuning this way
            modelfile_lines.append(f'MESSAGE user {sample["instruction"]}')
            modelfile_lines.append(f'MESSAGE assistant {sample["output"][:500]}')

        modelfile_path = self.output_dir / f"Modelfile.{output_name}"
        self.output_dir.mkdir(parents=True, exist_ok=True)

        with open(modelfile_path, 'w') as f:
            f.write('\n'.join(modelfile_lines))

        print(f"Modelfile created: {modelfile_path}")
        print(f"Create model with: ollama create {output_name} -f {modelfile_path}")

        return modelfile_path

    def create_axolotl_config(self, output_name: str) -> str:
        """
        Create Axolotl training config.

        Axolotl is a comprehensive fine-tuning framework.
        """
        config = f'''
base_model: {self.base_model}
model_type: AutoModelForCausalLM
tokenizer_type: AutoTokenizer

load_in_8bit: false
load_in_4bit: true
strict: false

datasets:
  - path: {self.training_data_dir}/prepared.json
    type: alpaca

dataset_prepared_path:
val_set_size: 0.05
output_dir: {self.output_dir}/{output_name}

adapter: lora
lora_r: 16
lora_alpha: 16
lora_dropout: 0.05
lora_target_modules:
  - q_proj
  - v_proj

sequence_len: 2048
sample_packing: true

gradient_accumulation_steps: 4
micro_batch_size: 2
num_epochs: 3
optimizer: paged_adamw_8bit
lr_scheduler: cosine
learning_rate: 2e-4

train_on_inputs: false
group_by_length: false
bf16: auto
fp16:
tf32: false

gradient_checkpointing: true
early_stopping_patience:
resume_from_checkpoint:
local_rank:
logging_steps: 1
warmup_steps: 10
evals_per_epoch: 4
saves_per_epoch: 1
'''

        config_path = self.output_dir / f"axolotl_{output_name}.yml"
        self.output_dir.mkdir(parents=True, exist_ok=True)

        with open(config_path, 'w') as f:
            f.write(config)

        print(f"Axolotl config created: {config_path}")
        print(f"Train with: axolotl train {config_path}")

        return config_path


def main():
    """Demo the pipeline."""
    pipeline = FineTuningPipeline()

    # Load data
    samples = pipeline.load_training_data()
    print(f"Loaded {len(samples)} training samples")

    if samples:
        # Prepare
        prepared = pipeline.prepare_dataset(samples)

        # Save prepared
        prepared_path = pipeline.training_data_dir / "prepared.json"
        with open(prepared_path, 'w') as f:
            json.dump(prepared, f, indent=2)

        print(f"Prepared {len(prepared)} samples for training")

        # Create configs
        pipeline.train_unsloth("antigravity-v1")
        pipeline.create_axolotol_config("antigravity-v1")
    else:
        print("No training data found. Collect some interactions first.")


if __name__ == "__main__":
    main()
