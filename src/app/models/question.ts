export interface IQuestionsEnvelope {
  questions: IQuestion[];
  questionCount: number;
}

export interface IQuestion {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  attendees: IAnswerBy[];
  comments: IComment[];
}
export interface IAnswerBy {
  id: string;
  username: string;
  email: string;
  displayName: string;
}

export interface IComment {
  id: string;
  username: string;
  email: string;
  displayName: string;
  body: string;
  createdAt: Date;
}

export interface IQuestionFormValues extends Partial<IQuestion> {
  time?: Date;
}

export class QuestionFormValues implements IQuestionFormValues {
  id?: string = undefined;
  title: string = '';
  description: string = '';
  date?: Date = undefined;
  time?: Date = undefined;

  constructor(init?: IQuestionFormValues) {
    if (init && init.createdAt) {
      init.time = init.createdAt;
    }
    Object.assign(this, init);
  }
}