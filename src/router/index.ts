import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import TasksView from "@/views/TasksView.vue";
import ExamDetailsView from "@/views/ExamDetailsView.vue";
import ExamAnswerView from "@/views/ExamAnswerView.vue";
import ExamAnswerNoStemView from "@/views/ExamAnswerNoStemView.vue";
import ExamReviseView from "@/views/ExamReviseView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "tasks",
      component: TasksView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/exam/:examTaskId/details",
      name: "examDetails",
      component: ExamDetailsView,
    },
    {
      path: "/exam/:examTaskId/answer",
      name: "examAnswer",
      component: ExamAnswerView,
    },
    {
      path: "/exam/:examTaskId/answerNoStem",
      name: "examAnswerNoStem",
      component: ExamAnswerNoStemView,
    },
    {
      path: "/exam/:examTaskId/revise",
      name: "examRevise",
      component: ExamReviseView,
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
