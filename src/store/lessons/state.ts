export interface LessonI {
  id: number;
  content: string;
  moduleId: number;
  order: number;
  title: string;
  transcript: string;
}

export interface LessonsStateI {
  lessons: LessonI[];
  lesson: LessonI;
}

export const state: LessonsStateI = {
  lessons: [],
  lesson: {
    moduleId: 0,
    content: '',
    id: 0,
    order: 0,
    title: '',
    transcript: '',
  },
};
