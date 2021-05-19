export interface IAnswersEnvelope {
  answers: IAnswer[];
  answerCount: number;
}

export interface IAnswer {
  _id: string;
  title: string;
  description: string;
  questionId: string;
  createdAt: Date;
  updatedAt: Date;
  answerBy: IAnswerBy;
}

export interface IAnswerBy {
  _id: string;
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
  _id?: string = undefined;
  title: string = '';
  description: string = '';
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  answerBy: IAnswerBy = {
    _id: '',
    username: '',
    email: '',
    displayName: ''
  };

  constructor(init?: IAnswerFormValues) {
    Object.assign(this, init);
  }
}