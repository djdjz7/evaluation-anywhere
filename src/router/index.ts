import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "tasks",
      component: () => import("@/views/TasksView.vue"),
      meta: {
        keepAlive: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/exam/:examTaskId/details",
      name: "examDetails",
      component: () => import("@/views/ExamDetailsView.vue"),
    },
    {
      path: "/exam/:examTaskId/answer",
      name: "examAnswer",
      component: () => import("@/views/ExamAnswerView.vue"),
    },
    {
      path: "/exam/:examTaskId/answerNoStem",
      name: "examAnswerNoStem",
      component: () => import("@/views/ExamAnswerNoStemView.vue"),
    },
    {
      path: "/exam/:examTaskId/revise",
      name: "examRevise",
      component: () => import("@/views/ExamReviseView.vue"),
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
