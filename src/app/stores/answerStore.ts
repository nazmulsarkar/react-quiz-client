import { observable, action, computed, runInAction, reaction, toJS } from 'mobx';
import { SyntheticEvent } from 'react';
import { IAnswer } from '../models/answer';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { setAnswerProps } from '../common/util/util';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';

const LIMIT = 2;

export default class AnswerStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0;
        this.answerRegistry.clear();
        this.loadAnswers();
      }
    )
  }

  @observable answerRegistry = new Map();
  @observable answer: IAnswer | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = '';
  @observable loading = false;
  @observable.ref hubConnection: HubConnection | null = null;
  @observable answerCount = 0;
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
    return Math.ceil(this.answerCount / LIMIT);
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
  };

  @action stopHubConnection = () => {
    this.hubConnection!.stop()
  }

  @computed get answersByDate() {
    return this.groupAnswersByDate(
      Array.from(this.answerRegistry.values())
    );
  }

  groupAnswersByDate(answers: IAnswer[]) {
    const sortedAnswers = answers.sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
    );
    return Object.entries(
      sortedAnswers.reduce(
        (answers, answer) => {
          const date = answer.createdAt.toISOString().split('T')[0];
          answers[date] = answers[date]
            ? [...answers[date], answer]
            : [answer];
          return answers;
        },
        {} as { [key: string]: IAnswer[] }
      )
    );
  }

  @action loadAnswers = async () => {
    this.loadingInitial = true;
    try {
      const answersEnvelope = await agent.Answers.list(this.axiosParams);
      const { answers, answerCount } = answersEnvelope;
      runInAction('loading answers', () => {
        answers.forEach(answer => {
          setAnswerProps(answer);
          this.answerRegistry.set(answer.id, answer);
        });
        this.answerCount = answerCount;
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction('load answers error', () => {
        this.loadingInitial = false;
      });
    }
  };

  @action loadAnswer = async (id: string) => {
    let answer = this.getAnswer(id);
    if (answer) {
      this.answer = answer;
      return toJS(answer);
    } else {
      this.loadingInitial = true;
      try {
        answer = await agent.Answers.details(id);
        runInAction('getting answer', () => {
          setAnswerProps(answer);
          this.answer = answer;
          this.answerRegistry.set(answer.id, answer);
          this.loadingInitial = false;
        });
        return answer;
      } catch (error) {
        runInAction('get answer error', () => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  @action clearAnswer = () => {
    this.answer = null;
  };

  getAnswer = (id: string) => {
    return this.answerRegistry.get(id);
  };

  @action createAnswer = async (answer: IAnswer) => {
    this.submitting = true;
    try {
      await agent.Answers.create(answer);
      runInAction('create answer', () => {
        this.answerRegistry.set(answer.id, answer);
        this.submitting = false;
      });
      history.push(`/answers/${answer.id}`);
    } catch (error) {
      runInAction('create answer error', () => {
        this.submitting = false;
      });
      toast.error('Problem submitting data');
      console.log(error.response);
    }
  };

  @action editAnswer = async (answer: IAnswer) => {
    this.submitting = true;
    try {
      await agent.Answers.update(answer);
      runInAction('editing answer', () => {
        this.answerRegistry.set(answer.id, answer);
        this.answer = answer;
        this.submitting = false;
      });
      history.push(`/answers/${answer.id}`);
    } catch (error) {
      runInAction('edit answer error', () => {
        this.submitting = false;
      });
      toast.error('Problem submitting data');
      console.log(error);
    }
  };

  @action deleteAnswer = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Answers.delete(id);
      runInAction('deleting answer', () => {
        this.answerRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      });
    } catch (error) {
      runInAction('delete answer error', () => {
        this.submitting = false;
        this.target = '';
      });
      console.log(error);
    }
  };
}
