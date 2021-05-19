import React, { useContext, Fragment } from 'react';
import { Item } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import QuestionListItem from './QuestionListItem';
import { RootStoreContext } from '../../../app/stores/rootStore';

const QuestionList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { questionsByDate } = rootStore.questionStore;
  return (
    <Fragment>
      <Item divided>
        {questionsByDate.map(question => (
          <QuestionListItem key={question._id} question={question} />
        ))}
      </Item>
    </Fragment>
  );
};

export default observer(QuestionList);
