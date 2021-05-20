import React, { Fragment, useContext, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import { observer } from 'mobx-react-lite';
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch
} from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';
import { RootStoreContext } from '../stores/rootStore';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import PrivateRoute from './PrivateRoute';
import { Role } from '../common/helpers/role';
import QuestionForm from '../../features/questions/form/QuestionForm';
import QuestionDashboard from '../../features/questions/dashboard/QuestionDashboard';
import QuestionDetails from '../../features/questions/details/QuestionDetails';
import AnswerDashboard from '../../features/answers/dashboard/AnswerDashboard';
import CreateAnswerForm from '../../features/questions/form/CreateAnswerForm';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded())
    } else {
      setAppLoaded();
    }
  }, [getUser, setAppLoaded, token])

  if (!appLoaded) return <LoadingComponent content='Loading app...' />

  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position='bottom-right' />
      <Route exact path='/' component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <PrivateRoute exact path='/questions' roles={[Role.Admin, Role.User]} component={QuestionDashboard} />
                <PrivateRoute path='/questions/:id' roles={[Role.Admin, Role.User]} component={QuestionDetails} />
                <PrivateRoute key={location.key} exact path='/questions/:id/createAnswer' roles={[Role.User]} component={CreateAnswerForm} />
                <PrivateRoute
                  key={location.key}
                  path={['/createQuestion', '/manage/:id']}
                  roles={[Role.Admin]}
                  component={QuestionForm}
                />
                <PrivateRoute exact path='/answers' roles={[Role.Admin]} component={AnswerDashboard} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
