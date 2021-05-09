import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import AnswerDetailedHeader from './AnswerDetailedHeader';
import AnswerDetailedInfo from './AnswerDetailedInfo';
import { RootStoreContext } from '../../../app/stores/rootStore';

interface DetailParams {
  id: string;
}

const AnswerDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const rootStore = useContext(RootStoreContext);
  const { answer, loadAnswer, loadingInitial } = rootStore.answerStore;

  useEffect(() => {
    loadAnswer(match.params.id);
  }, [loadAnswer, match.params.id, history]);

  if (loadingInitial) return <LoadingComponent content='Loading answer...' />;

  if (!answer) return <h2>Answer not found</h2>;

  return (
    <Grid>
      <Grid.Column width={10}>
        <AnswerDetailedHeader answer={answer} />
        <AnswerDetailedInfo answer={answer} />
      </Grid.Column>
      <Grid.Column width={6}>

      </Grid.Column>
    </Grid>
  );
};

export default observer(AnswerDetails);
