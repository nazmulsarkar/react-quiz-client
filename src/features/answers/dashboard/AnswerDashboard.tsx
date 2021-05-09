import React, { useContext, useEffect, useState } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import AnswerList from './AnswerList';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import InfiniteScroll from 'react-infinite-scroller';
import AnswerFilters from './AnswerFilters';
import AnswerListItemPlaceholder from './AnswerListItemPlaceholder';

const AnswerDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadAnswers,
    loadingInitial,
    setPage,
    page,
    totalPages
  } = rootStore.answerStore;
  const [loadingNext, setLoadingNext] = useState(false);

  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page + 1);
    loadAnswers().then(() => setLoadingNext(false));
  };

  useEffect(() => {
    loadAnswers();
  }, [loadAnswers]);

  return (
    <Grid>
      <Grid.Column width={10}>
        {loadingInitial && page === 0 ? (
          <AnswerListItemPlaceholder />
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!loadingNext && page + 1 < totalPages}
            initialLoad={false}
          >
            <AnswerList />
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width={6}>
        <AnswerFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(AnswerDashboard);
