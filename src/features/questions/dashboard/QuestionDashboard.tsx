import React, { useContext, useEffect, useState } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import QuestionList from './QuestionList';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import InfiniteScroll from 'react-infinite-scroller';
import QuestionFilters from './QuestionFilters';
import QuestionListItemPlaceholder from './QuestionListItemPlaceholder';

const QuestionDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadQuestions,
    loadingInitial,
    setPage,
    page,
    totalPages
  } = rootStore.questionStore;
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page + 1);
    loadQuestions().then(() => setLoadingNext(false));
  };

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  return (
    <Grid>
      <Grid.Column width={10}>
        {loadingInitial && page === 0 ? (
          <QuestionListItemPlaceholder />
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!loadingNext && page + 1 < totalPages}
            initialLoad={false}
          >
            <QuestionList />
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width={6}>
        <QuestionFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(QuestionDashboard);
