import { observable, computed, action, runInAction } from 'mobx';
import { IUser, IUserFormValues } from '../models/user';
import agent from '../api/agent';
import { RootStore } from './rootStore';
import { history } from '../..';
import { Role } from '../common/helpers/role';

export default class UserStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable user: IUser | null = null;
  @observable currentRoles: string[] = [];

  @computed get isLoggedIn() {
    return !!this.user;
  }


  @action login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push('/questions');
    } catch (error) {
      throw error;
    }
  };

  @action register = async (values: IUserFormValues) => {
    try {
      let user;
      if (values.role === Role.Admin) {
        values.role = undefined;
        user = await agent.User.registerAdmin(values);
      } else if (values.role === Role.User) {
        values.role = undefined;
        user = await agent.User.registerUser(values);
      } else {
        values.roles = [Role.Anonymous];
        values.role = undefined;
      }

      // this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      if (user) console.log(user);
      // history.push('/questions')
    } catch (error) {
      throw error;
    }
  }

  @action getUser = async () => {
    try {
      const user = await agent.User.current();
      runInAction(() => {
        this.user = user;
        if (user && user.roles) this.currentRoles = user.roles;
      });
    } catch (error) {
      console.log(error);
    }
  };

  @action logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push('/');
  };
}
