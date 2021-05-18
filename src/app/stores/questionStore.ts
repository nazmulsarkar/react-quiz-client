import { observable, action, computed, runInAction, reaction, toJS } from 'mobx';
import { SyntheticEvent } from 'react';
import { IQuestion } from '../models/question';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { setQuestionProps, createAttendee } from '../common/util/util';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';

const LIMIT = 2;

export default class QuestionStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0;
        this.questionRegistry.clear();
        this.loadQuestions();
      }
    )
  }

  @observable questionRegistry = new Map();
  @observable question: IQuestion | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = '';
  @observable loading = false;
  @observable.ref hubConnection: HubConnection | null = null;
  @observable questionCount = 0;
  @observable page = 0;
  @observable predicate = new Map();

  @action setPredicate = (predicate: string, value: string | Date) => {
    this.predicate.clear();
    if (predicate !== 'all') {
      this.predicate.set(predicate, value);
    }
  }

  @computed get axiosParams() {
    const params = new URLSearchParams();
    params.append('limit', String(LIMIT));
    params.append('offset', `${this.page ? this.page * LIMIT : 0}`);
    this.predicate.forEach((value, key) => {
      if (key === 'startDate') {
        params.append(key, value.toISOString())
      } else {
        params.append(key, value)
      }
    })
    return params;
  }

  @computed get totalPages() {
    return Math.ceil(this.questionCount / LIMIT);
  }

  @action setPage = (page: number) => {
    this.page = page;
  }

  @action createHubConnection = () => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
        accessTokenFactory: () => this.rootStore.commonStore.token!
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(this.hubConnection!.state))
      .catch(error => console.log('Error establishing connection: ', error));

    this.hubConnection.on('ReceiveComment', comment => {
      runInAction(() => {
        this.question!.comments.push(comment)
      })
    })
  };

  @action stopHubConnection = () => {
    this.hubConnection!.stop()
  }

  @action addComment = async (values: any) => {
    values.questionId = this.question!.id;
    try {
      await this.hubConnection!.invoke('SendComment', values)
    } catch (error) {
      console.log(error);
    }
  }

  @computed get questionsByDate() {
    return this.groupQuestionsByDate(
      Array.from(this.questionRegistry.values())
    );
  }

  groupQuestionsByDate(questions: IQuestion[]) {
    const sortedQuestions = questions.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
    return Object.entries(
      sortedQuestions.reduce(
        (questions, question) => {
          const date = question.createdAt.toISOString().split('T')[0];
          questions[date] = questions[date]
            ? [...questions[date], question]
            : [question];
          return questions;
        },
        {} as { [key: string]: IQuestion[] }
      )
    );
  }

  @action loadQuestions = async () => {
    this.loadingInitial = true;
    try {
      const questionsEnvelope = await agent.Questions.list(this.axiosParams);
      const { questions, questionCount } = questionsEnvelope;
      runInAction('loading questions', () => {
        questions.forEach(question => {
          setQuestionProps(question);
          this.questionRegistry.set(question.id, question);
        });
        this.questionCount = questionCount;
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction('load questions error', () => {
        this.loadingInitial = false;
      });
    }
  };

  @action loadQuestion = async (id: string) => {
    let question = this.getQuestion(id);
    if (question) {
      this.question = question;
      return toJS(question);
    } else {
      this.loadingInitial = true;
      try {
        question = await agent.Questions.details(id);
        runInAction('getting question', () => {
          setQuestionProps(question);
          this.question = question;
          this.questionRegistry.set(question.id, question);
          this.loadingInitial = false;
        });
        return question;
      } catch (error) {
        runInAction('get question error', () => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  @action clearQuestion = () => {
    this.question = null;
  };

  getQuestion = (id: string) => {
    return this.questionRegistry.get(id);
  };

  @action createQuestion = async (question: IQuestion) => {
    this.submitting = true;
    try {
      await agent.Questions.create(question);
      const attendee = createAttendee(this.rootStore.userStore.user!);
      let attendees = [];
      attendees.push(attendee);
      question.attendees = attendees;
      question.comments = [];
      runInAction('create question', () => {
        this.questionRegistry.set(question.id, question);
        this.submitting = false;
      });
      history.push(`/questions/${question.id}`);
    } catch (error) {
      runInAction('create question error', () => {
        this.submitting = false;
      });
      toast.error('Problem submitting data');
      console.log(error.response);
    }
  };

  @action editQuestion = async (question: IQuestion) => {
    this.submitting = true;
    try {
      await agent.Questions.update(question);
      runInAction('editing question', () => {
        this.questionRegistry.set(question.id, question);
        this.question = question;
        this.submitting = false;
      });
      history.push(`/questions/${question.id}`);
    } catch (error) {
      runInAction('edit question error', () => {
        this.submitting = false;
      });
      toast.error('Problem submitting data');
      console.log(error);
    }
  };

  @action deleteQuestion = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Questions.delete(id);
      runInAction('deleting question', () => {
        this.questionRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      });
    } catch (error) {
      runInAction('delete question error', () => {
        this.submitting = false;
        this.target = '';
      });
      console.log(error);
    }
  };

  @action attendQuestion = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    try {
      await agent.Questions.attend(this.question!.id);
      runInAction(() => {
        if (this.question) {
          this.question.attendees.push(attendee);
          this.questionRegistry.set(this.question.id, this.question);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error('Problem signing up to question');
    }
  };

  @action cancelAttendance = async () => {
    this.loading = true;
    try {
      await agent.Questions.unattend(this.question!.id);
      runInAction(() => {
        if (this.question) {
          this.question.attendees = this.question.attendees.filter(
            a => a.username !== this.rootStore.userStore.user!.username
          );
          this.questionRegistry.set(this.question.id, this.question);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error('Problem cancelling attendance');
    }
  };
}
