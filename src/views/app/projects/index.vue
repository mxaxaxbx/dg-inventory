<template>
  <!-- header -->
  <div
    class="
      flex justify-between items-center
      mb-4 px-3 py-2
      bg-gray-300
      border border-gray-400
      text-sm
      sticky top-0 z-10 w-full
    "
  >
    <h1 class="text-2xl font-bold">Proyectos</h1>
    <!-- add button -->
    <router-link
      to="/app/projects/add"
      class="
        bg-orange-500
        hover:bg-orange-700
        text-white font-bold
        py-2 px-4
        rounded
      "
    >
      <i class="fas fa-plus"></i>
      <span class="hidden md:inline"> Agregar proyecto </span>
    </router-link>
  </div>
  <!-- projects list -->
  <!-- <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div v-for="p in projects" :key="p.id" class="bg-white p-4">
      <h2 class="text-lg font-bold">{{ p.name }}</h2>
    </div>
  </div> -->
</template>
