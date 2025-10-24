<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white shadow-lg rounded-lg py-6">
      <div class="mb-4">
        <div
          contenteditable="true"
          class="text-3xl font-bold outline-none mb-8 p-2 hover:bg-gray-50 rounded"
          id="title"
          data-placeholder="Untitled"
          @input="updateTitle"
          ref="titleRef"
        >
          {{ props.modelValue.title }}
        </div>
      </div>
      <div ref="editor" class="space-y-2" @input="updateContent"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  defineProps,
  defineEmits,
  watch,
  nextTick,
} from 'vue';

const props = defineProps<{
  modelValue: {
    title: string;
    content: string;
  }
}>();

const emit = defineEmits<{
  'update:modelValue': [value: { title: string; content: string }]
}>();

const titleRef = ref<HTMLElement | null>(null);
const editor = ref<HTMLElement | null>(null);
const blocks = ref<HTMLElement[]>([]);
const currentContent = ref('');
const isTyping = ref(false);

let typingTimeout: number;

function updateTitle(e: Event) {
  const title = (e.target as HTMLElement)?.textContent || '';
  emit('update:modelValue', { ...props.modelValue, title });
}

function updateContent() {
  if (!editor.value) return;
  isTyping.value = true;
  clearTimeout(typingTimeout);

  const content = editor.value.innerHTML;
  if (content !== currentContent.value) {
    currentContent.value = content;
    emit('update:modelValue', { ...props.modelValue, content });
  }

  // reset typing flag after a delay
  typingTimeout = setTimeout(() => {
    isTyping.value = false;
  }, 500);
}

function createBlock(type: string, content = '', className = ''): HTMLElement {
  const block = document.createElement('div');
  block.className = 'bg-white p-4 rounded-lg shadow-md block-container';

  const contentDiv = document.createElement(type);
  contentDiv.contentEditable = 'true';
  contentDiv.className = `outline-none p-2 w-full min-h-[1.5em] rounded hover:bg-gray-50 focus:bg-gray-50 ${className}`;
  contentDiv.innerHTML = content;

  const addButton = document.createElement('button');
  addButton.className = 'bg-orange-500 text-white px-4 py-2 rounded hover:bg-blue-600';
  addButton.innerHTML = '+';
  addButton.type = 'button';
  // eslint-disable-next-line no-use-before-define
  // addButton.onclick = () => addBlock({});

  block.appendChild(contentDiv);
  block.appendChild(addButton);

  return block;
}

function addBlock({
  type = 'p',
  content = '',
  className = '',
}): HTMLElement {
  const block = createBlock(type, content, className);

  editor.value?.appendChild(block);

  blocks.value.push(block);
  return block;
}

function clearEditor() {
  if (editor.value) {
    editor.value.innerHTML = '';
    blocks.value = [];
  }
}

function initializeDefaultContent() {
  clearEditor();
  addBlock({
    type: 'p',
    content: 'Type "/" for commands',
  });
}

function parseExistingContent() {
  if (!editor.value) return;

  const { content } = props.modelValue;

  if (!content) {
    initializeDefaultContent();
    return;
  }

  if (content === currentContent.value || isTyping.value) return;

  clearEditor();

  currentContent.value = content;

  // Clear existing blocks
  // editor.value.innerHTML = '';
  // blocks.value = [];

  // Create a temporary container to parse the HTML
  const temp = document.createElement('div');
  temp.innerHTML = props.modelValue.content;

  // Convert each block container into our block format
  temp.querySelectorAll('.block-container').forEach((blockElement) => {
    const contentElement = blockElement.querySelector('[contenteditable]');
    if (contentElement) {
      const type = contentElement.tagName.toLowerCase();
      const ct = contentElement.innerHTML;
      const { className } = contentElement;
      addBlock({ type, content: ct, className });
    }
  });

  // If no blocks were found, create a default block with the content
  if (blocks.value.length === 0) {
    addBlock({
      type: 'p',
      content: props.modelValue.content,
    });
  }
}

function init() {
  if (props.modelValue.title) {
    parseExistingContent();
  }
  addBlock({
    type: 'p',
    content: 'Type "/" for commands',
  });
}

function setCaretPosition(el: HTMLElement, position: number) {
  const range = document.createRange();
  const sel = window.getSelection();
  if (el && el.firstChild) {
    range.setStart(el.firstChild, position);
  } else if (el instanceof Node) {
    range.setStart(el, position);
  }
  range.collapse(true);
  sel?.removeAllRanges();
  sel?.addRange(range);

  if (el) {
    el.focus();
  }
}

function handleSlashCommand(e: KeyboardEvent) {
  const block = (e.target as Element)?.closest('.block-container');
  if (!block) return;
  const contentDiv = block.querySelector('[contenteditable]') as HTMLElement;

  const menu = document.createElement('div');
  menu.className = 'absolute bg-white shadow-md p-2 rounded';
  menu.style.top = `${contentDiv.offsetTop + contentDiv.offsetHeight}px`;
  menu.style.left = `${contentDiv.offsetLeft}px`;
  menu.innerHTML = `
    <div class="py-1">
      <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" data-type="h1" data-class="text-3xl font-bold">Heading 1</button>
      <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" data-type="h2" data-class="text-2xl font-bold">Heading 2</button>
      <button class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left" data-type="p" data-class="text-lg">Paragraph</button>
    </div>
  `;

  block.appendChild(menu);

  const handleCommand = (ev: MouseEvent) => {
    const type = (ev.target as HTMLElement)?.dataset?.type;
    const className = (ev.target as HTMLElement)?.dataset?.class;

    if (type) {
      contentDiv.textContent = '';

      const newBlock = addBlock({
        type,
        className,
      });
      block.replaceWith(newBlock);

      const index = blocks.value.indexOf(block as HTMLElement);

      blocks.value[index] = newBlock;

      (newBlock.querySelector('[contenteditable]') as HTMLElement)?.focus();
    }

    menu.remove();
    document.removeEventListener('click', handleCommand);
  };

  document.addEventListener('click', handleCommand);
}

function setupEventListeners() {
  editor.value?.addEventListener('keydown', (e: KeyboardEvent) => {
    const block = (e.target as Element)?.closest('.block-container');
    if (!block) return;

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const newBlock = addBlock({});
      (newBlock.querySelector('[contenteditable]') as HTMLElement)?.focus();
    }

    if (
      e.key === 'Backspace'
      && (e.target as HTMLElement)?.textContent?.length === 0
      && blocks.value.length > 1
    ) {
      e.preventDefault();
      const index = blocks.value.indexOf(block as HTMLElement);
      if (index > 0) {
        const previousBlock = blocks.value[index - 1];
        const previousContent = previousBlock.querySelector('[contenteditable]') as HTMLElement;
        const caretPosition = previousContent?.textContent?.length;
        block.remove();

        blocks.value.splice(index, 1);

        previousContent?.focus();

        setCaretPosition(previousContent, caretPosition || 0);
      }
    }

    if (e.key === '/') {
      e.preventDefault();
      handleSlashCommand(e);
    }
  });

  editor.value?.addEventListener('click', (e: MouseEvent) => {
    if (e.target && (e.target as Element).tagName === 'BUTTON') {
      const block = (e.target as Element)?.closest('.block-container');
      if (!block) return;

      const index = blocks.value.indexOf(block as HTMLElement);
      const newBlock = addBlock({});
      blocks.value.splice(index + 1, 0, newBlock);
      (newBlock.querySelector('[contenteditable]') as HTMLElement)?.focus();
    }
  });
}

onMounted(() => {
  init();
  setupEventListeners();
});

watch(
  () => props.modelValue,
  async (newValue, oldValue) => {
    if (!newValue) return;

    // Check if content actually changed
    if (newValue.content !== oldValue?.content) {
      await nextTick();
      parseExistingContent();
    }

    // Update title if changed
    if (titleRef.value && newValue.title !== oldValue?.title) {
      titleRef.value.textContent = newValue.title || 'Untitled';
    }
  },
  { deep: true, immediate: true },
);

</script>
