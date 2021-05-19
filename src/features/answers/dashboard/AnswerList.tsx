import React, { useContext, Fragment } from 'react';
import { Item, Label } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import AnswerListItem from './AnswerListItem';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { format } from 'date-fns';

const AnswerList: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { answersByDate } = rootStore.answerStore;
  return (
    <Fragment>
      {answersByDate.map(([group, answers]) => (
        <Fragment key={group}>
          <Label size='large' color='blue'>
            {format(new Date(group), 'eeee do MMMM')}
          </Label>
          <Item.Group divided>
            {answers.map(answer => (
              <AnswerListItem key={answer._id} answer={answer} />
            ))}
          </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(AnswerList);
