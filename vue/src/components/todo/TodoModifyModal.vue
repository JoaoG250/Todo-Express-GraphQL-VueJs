<script setup lang="ts">
import { reactive, watch } from "vue";
import {
  NModal,
  NCard,
  NButton,
  NInput,
  NCheckbox,
  NSpace,
  NFormItem,
  useMessage,
} from "naive-ui";
import { useTodoStore } from "@/stores/todo";
import { computed } from "@vue/reactivity";

const message = useMessage();
const todoStore = useTodoStore();
const { closeModal } = todoStore.actions;

const open = computed(() => todoStore.state.modalOpen);
const submitMessage = computed(() => {
  if (todoStore.state.modalTodo) {
    return "Todo updated successfully!";
  } else {
    return "Todo created successfully!";
  }
});
const modalTitle = computed(() => {
  if (todoStore.state.modalTodo) {
    return "Edit Todo";
  } else {
    return "Create Todo";
  }
});
const form = reactive({
  title: "",
  description: "",
  done: false,
});

watch(
  () => todoStore.state.modalTodo,
  (todo) => {
    form.title = todo?.title || "";
    form.description = todo?.description || "";
    form.done = todo?.done || false;
  }
);

function resetForm() {
  form.title = "";
  form.description = "";
  form.done = false;
}

async function submit() {
  if (todoStore.state.modalTodo) {
    await todoStore.actions.updateTodo(todoStore.state.modalTodo.id, form);
  } else {
    await todoStore.actions.createTodo({
      title: form.title,
      description: form.description,
    });
  }

  message.success(submitMessage.value);
  resetForm();
  closeModal();
}
</script>

<template>
  <n-modal :show="open">
    <n-card
      :title="modalTitle"
      size="huge"
      role="dialog"
      style="width: 600px"
      aria-modal="true"
      :bordered="false"
    >
      <n-space size="small" vertical>
        <n-form-item path="title" label="Title">
          <n-input v-model:value="form.title" type="text" />
        </n-form-item>
        <n-form-item path="description" label="Description">
          <n-input v-model:value="form.description" type="text" />
        </n-form-item>
        <n-checkbox
          v-if="todoStore.state.modalTodo"
          v-model:checked="form.done"
        >
          Done
        </n-checkbox>
      </n-space>
      <template #footer>
        <n-space justify="end">
          <n-button quaternary @click="closeModal">Close</n-button>
          <n-button type="primary" @click="submit">Save</n-button>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped></style>
