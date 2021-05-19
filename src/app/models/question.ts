export interface IQuestionsEnvelope {
  questions: IQuestion[];
  questionCount: number;
}

export interface IQuestion {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  attendees: IAnswerBy[];
  comments: IComment[];
}
export interface IAnswerBy {
  _id: string;
  username: string;
  email: string;
  displayName: string;
}

export interface IComment {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  body: string;
  createdAt: string;
}

export interface IQuestionFormValues extends Partial<IQuestion> {
  createdAt?: string;
}

export class QuestionFormValues implements IQuestionFormValues {
  _id?: string = undefined;
  title: string = '';
  description: string = '';
  createdAt?: string = undefined;

  constructor(init?: IQuestionFormValues) {
    Object.assign(this, init);
  }
}