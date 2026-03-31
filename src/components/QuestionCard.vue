<template>
  <div class="q-card" :class="{ answered: modelValue !== undefined }">
    <!-- <div class="q-header">
      <span class="q-id">{{ question.id }}</span>
      <span class="q-dim" :class="question.dimension">
        {{ question.dimension === 'economic' ? '经济' : '权威' }}
      </span>
    </div> -->
    <p class="q-text">{{ question.text }}</p>
    <div class="options" role="radiogroup" :aria-label="question.text">
      <button
        v-for="opt in options"
        :key="opt.value"
        role="radio"
        :aria-checked="modelValue === opt.value"
        class="opt-btn"
        :class="{
          active: modelValue === opt.value,
          negative: opt.value < 0,
          positive: opt.value > 0,
        }"
        @click="$emit('update:modelValue', opt.value)"
      >
        <span class="opt-label">{{ opt.label }}</span>
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
  { value:  0, label: '中立' },
  { value:  1, label: '同意' },
  { value:  2, label: '强烈同意' },
]
</script>

<style scoped>
.q-card {
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  padding: 20px 22px;
  box-shadow: var(--shadow-sm);
  transition: border-color 0.18s, box-shadow 0.18s;
}

.q-card.answered {
  border-color: #bfdbfe;
}

.q-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.q-id {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-3);
  background: var(--bg-subtle);
  padding: 2px 7px;
  border-radius: 4px;
  font-variant-numeric: tabular-nums;
}

.q-dim {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
}

.q-dim.economic { background: #eff6ff; color: #1d4ed8; }
.q-dim.authoritarian { background: #fdf4ff; color: #7c3aed; }

.q-text {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text);
  margin-bottom: 16px;
  font-weight: 500;
}

.options {
  display: flex;
  gap: 6px;
}

.opt-btn {
  flex: 1;
  padding: 9px 6px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-card);
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-2);
  font-family: inherit;
  transition: var(--transition);
  text-align: center;
}

.opt-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-light);
}

.opt-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(37,99,235,.2);
}

@media (max-width: 640px) {
  .options {
    flex-wrap: wrap;
  }
  .opt-btn {
    min-width: calc(33.33% - 6px);
    font-size: 11px;
    padding: 8px 4px;
  }
}
</style>
