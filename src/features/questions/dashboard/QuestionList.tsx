import React, { useContext, Fragment } from 'react';
import { Item, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import QuestionListItem from './QuestionListItem';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { format } from 'date-fns';

const QuestionList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { questionsByDate } = rootStore.questionStore;
  return (
    <Fragment>
      {questionsByDate.map(([group, questions]) => (
        <Fragment key={group}>
          <Label size='large' color='blue'>
            {format(new Date(group), 'eeee do MMMM')}
          </Label>
          <Item.Group divided>
            {questions.map(question => (
              <QuestionListItem key={question._id} question={question} />
            ))}
          </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(QuestionList);
