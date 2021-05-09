import QuestionStore from './questionStore';
import AnswerStore from './answerStore';
import UserStore from './userStore';
import { createContext } from 'react';
import { configure } from 'mobx';
import CommonStore from './commonStore';
import ModalStore from './modalStore';

configure({ enforceActions: 'always' });

export class RootStore {
    questionStore: QuestionStore;
    answerStore: AnswerStore;
    userStore: UserStore;
    commonStore: CommonStore;
    modalStore: ModalStore;

    constructor() {
        this.questionStore = new QuestionStore(this);
        this.answerStore = new AnswerStore(this);
        this.userStore = new UserStore(this);
        this.commonStore = new CommonStore(this);
        this.modalStore = new ModalStore(this);
    }
}

export const RootStoreContext = createContext(new RootStore());