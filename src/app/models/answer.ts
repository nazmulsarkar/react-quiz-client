export interface IAnswersEnvelope {
  answers: IAnswer[];
  answerCount: number;
}

export interface IAnswer {
  id: string;
  title: string;
  description: string;
  questionId: string;
  createdAt: Date;
  updatedAt: Date;
  answerBy: IAnswerBy;
}

export interface IAnswerBy {
  id: string;
  username: string;
  email: string;
  displayName: string;
}

export interface IAnswerFormValues extends Partial<IAnswer> {
  createdAt: Date;
  updatedAt: Date;
  answerBy: IAnswerBy;
}

export class AnswerFormValues implements IAnswerFormValues {
  id?: string = undefined;
  title: string = '';
  description: string = '';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  answerBy: IAnswerBy = {
    id: '',
    username: '',
    email: '',
    displayName: ''
  };

  constructor(init?: IAnswerFormValues) {
    Object.assign(this, init);
  }
}