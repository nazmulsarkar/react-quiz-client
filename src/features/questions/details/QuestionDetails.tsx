import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import QuestionDetailedHeader from './QuestionDetailedHeader';
import QuestionDetailedInfo from './QuestionDetailedInfo';
import { RootStoreContext } from '../../../app/stores/rootStore';

interface DetailParams {
  id: string;
}

const QuestionDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const rootStore = useContext(RootStoreContext);
  const { question, loadQuestion, loadingInitial } = rootStore.questionStore;

  useEffect(() => {
    loadQuestion(match.params.id);
  }, [loadQuestion, match.params.id, history]);

  if (loadingInitial) return <LoadingComponent content='Loading question...' />;

  if (!question) return <h2>Question not found</h2>;

  return (
    <Grid>
      <Grid.Column width={10}>
        <QuestionDetailedHeader question={question} />
        <QuestionDetailedInfo question={question} />
      </Grid.Column>
      <Grid.Column width={6}>
      </Grid.Column>
    </Grid>
  );
};

export default observer(QuestionDetails);
