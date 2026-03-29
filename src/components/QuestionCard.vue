<template>
  <div class="question-card">
    <div class="question-header">
      <span class="question-id">{{ question.id }}</span>
      <span class="question-dim" :class="question.dimension">
        {{ question.dimension === 'economic' ? '经济' : '权威' }}
      </span>
    </div>
    <p class="question-text">{{ question.text }}</p>
    <div class="options">
      <button
        v-for="opt in options"
        :key="opt.value"
        class="option-btn"
        :class="{ active: modelValue === opt.value }"
        @click="$emit('update:modelValue', opt.value)"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  question: { type: Object, required: true },
  modelValue: { type: Number, default: undefined },
})

defineEmits(['update:modelValue'])

const options = [
  { value: -2, label: '强烈反对' },
  { value: -1, label: '反对' },
  { value: 0,  label: '中立' },
  { value: 1,  label: '同意' },
  { value: 2,  label: '强烈同意' },
]
</script>

<style scoped>
.question-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  transition: border-color 0.2s;
}

.question-card:hover {
  border-color: #475569;
}

.question-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.question-id {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.06);
  padding: 2px 8px;
  border-radius: 4px;
}

.question-dim {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.question-dim.economic {
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
}

.question-dim.authoritarian {
  background: rgba(244, 114, 182, 0.15);
  color: #f472b6;
}

.question-text {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
  color: var(--color-text);
}

.options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.option-btn {
  flex: 1;
  min-width: 80px;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.option-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-text);
}

.option-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
  font-weight: 600;
}

@media (max-width: 640px) {
  .options {
    flex-wrap: wrap;
  }
  .option-btn {
    min-width: calc(33% - 8px);
    font-size: 12px;
    padding: 8px 6px;
  }
}
</style>
