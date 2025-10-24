<template>
  <div class="bg-white p-4 rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-gray-800">
      Add Quiz | {{ m.title }}
    </h1>
    <!-- line -->
    <div class="my-4 border-b border-gray-200"></div>
    <!-- form -->
    <form @submit.prevent="submit">
      <!-- title -->
      <div class="mb-4">
        <label for="title" class="block text-sm font-bold text-gray-700">Title</label>
        <input
          v-model="quizz.quiz.title"
          type="text"
          id="title"
          name="title"
          :required="true"
          class="
            mt-1
            block
            w-full
            px-3 py-2
            border border-gray-300 rounded-md shadow-sm
            focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
          "
          />
      </div>
      <!-- questions -->
      <h3 class="text-lg font-bold text-gray-800">Questions</h3>
      <!-- add question -->
      <div class="pl-4">
        <button
          @click="addQuestion"
          type="button"
          class="
            mt-2
            px-4 py-2 mb-8
            text-sm
            font-medium
            text-white
            bg-orange-600
            border border-transparent
            rounded-md
            shadow-sm
            hover:bg-orange-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
          Add Question
        </button>
      </div>
      <!-- questions -->
      <div
        v-for="(question, index) in quizz.questions"
        :key="index"
        class="border border-gray-200 rounded-lg p-4 mb-4"
      >
        <!-- question -->
        <div class="mb-4">
          <label for="question" class="block text-sm font-bold text-gray-700">
            Question {{ index + 1 }}
          </label>
          <div class="flex">
            <input
              v-model="question.question.question"
              type="text"
              id="question"
              name="question"
              :required="true"
              class="
                mt-1
                block
                w-full
                px-3 py-2
                border border-gray-300 rounded-md shadow-sm
                focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
              "
            />
            <!-- remove question -->
            <button
              @click="removeQuestion(index)"
              type="button"
              class="
                ml-2
                px-4 py-2
                text-sm
                font-medium
                text-white
                bg-blue-600
                border border-transparent
                rounded-md
                shadow-sm
                hover:bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
        <!-- answers -->
        <h4 class="pl-4 text-lg font-bold text-gray-800">Answers</h4>
        <!-- add answer -->
        <div class="pl-4">
          <button
            @click="addAnswer(index)"
            type="button"
            class="
              mt-2
              px-4 py-2 mb-8
              text-sm
              font-medium
              text-white
              bg-orange-600
              border border-transparent
              rounded-md
              shadow-sm
              hover:bg-orange-700
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
            Add Answer
          </button>
        </div>
        <div class="pl-4" v-for="(answer, aIndex) in question.answers" :key="aIndex">
          <div class="mb-4">
            <label for="answer" class="block text-sm font-bold text-gray-700">
              Answer {{ aIndex + 1 }}
            </label>
            <!-- radio for is correct -->
            <div
              class="
                flex items-center
                ps-4
                border border-gray-200
                rounded-sm
              "
            >
              <input
                v-model="answer.isCorrect"
                type="radio"
                :id="`isCorrect-${index}-${aIndex}`"
                :name="`isCorrect-${index}`"
                class="
                  w-4 h-4
                  text-blue-600 bg-gray-100 border-gray-300
                  focus:ring-blue-500 focus:ring-2
                "
              />
              <!-- answer -->
              <input
                v-model="answer.answer"
                type="text"
                id="answer"
                name="answer"
                :required="true"
                class="
                  mt-1 ml-2
                  block
                  w-full h-full
                  px-3 py-2
                  border border-gray-300 rounded-md shadow-sm
                  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                "
              />
              <!-- remove answer -->
              <button
                @click="removeAnswer(index, aIndex)"
                type="button"
                class="
                  ml-2
                  px-4 py-2
                  text-sm
                  font-medium
                  text-white
                  bg-blue-600
                  border border-transparent
                  rounded-md
                  shadow-sm
                  hover:bg-blue-700
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- submit -->
      <div class="flex justify-end mt-4">
        <button
          type="submit"
          class="
            px-4 py-2
            text-sm
            font-medium
            text-white
            bg-orange-600
            border border-transparent
            rounded-md
            shadow-sm
            hover:bg-orange-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          :disabled="loading"
        >
          {{ loading ? 'Loading...' : 'Submit' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

import axios from 'axios';
import { ModuleI } from '@/store/modules/state';
import { QuizExtructureI } from '@/store/quizzes/state';

const store = useStore();
const route = useRoute();

const m = computed<ModuleI>(() => store.state.modules.module);

const loading = ref(false);
const quizz = ref<QuizExtructureI>({
  quiz: {
    title: '',
    moduleId: 0,
  },
  questions: [],
});

async function submit() {
  loading.value = true;
  try {
    // check if there are two or more answers
    const hasTwoOrMoreAnswers = quizz.value.questions.every((q) => q.answers.length >= 2);
    if (!hasTwoOrMoreAnswers) {
      store.commit('notifications/addNotification', {
        message: 'Please add at least two answers for each question.',
        type: 'warning',
      });
      return;
    }
    // check if some answer is correct
    const hasCorrectAnswer = quizz.value.questions.some((q) => q.answers.some((a) => a.isCorrect));
    if (!hasCorrectAnswer) {
      store.commit('notifications/addNotification', {
        message: 'Please select a correct answer for each question.',
        type: 'warning',
      });
      return;
    }
    await store.dispatch('quizzes/create', quizz.value);
    store.dispatch('notifications/addNotification', {
      message: 'Quiz created successfully.',
      type: 'success',
    });
  } catch (error: any) {
    console.error(error);
    const msg = error.response.data.error || 'An error occurred while creating the quiz.';
    store.commit('notifications/addNotification', {
      message: msg,
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
}

function removeQuestion(index: number) {
  quizz.value.questions.splice(index, 1);
}

function removeAnswer(questionIndex: number, answerIndex: number) {
  quizz.value.questions[questionIndex].answers.splice(answerIndex, 1);
}

function addAnswer(questionIndex: number) {
  quizz.value.questions[questionIndex].answers.push({
    answer: '',
    isCorrect: false,
  });
}

function addQuestion() {
  quizz.value.quiz.moduleId = m.value.id;
  quizz.value.questions.push({
    question: {
      question: '',
    },
    answers: [],
  });

  addAnswer(quizz.value.questions.length - 1);
}

async function getModule() {
  loading.value = true;
  try {
    await store.dispatch('modules/get', route.params.moduleId);
    addQuestion();
  } catch (error: any) {
    console.error(error);
    const msg = error.response.data.message || 'An error occurred while fetching the module.';
    store.dispatch('notifications/addNotification', {
      message: msg,
      type: 'error',
    });
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getModule();
});

</script>
