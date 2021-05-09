import React, { useContext } from 'react'
import { RouteProps, RouteComponentProps, Route, Redirect } from 'react-router-dom';
import { RootStoreContext } from '../stores/rootStore';
import { observer } from 'mobx-react-lite';

interface IProps extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>>,
    roles: string[]
}

const PrivateRoute: React.FC<IProps> = ({ component: Component, roles, ...rest }) => {
    const rootStore = useContext(RootStoreContext);
    const { isLoggedIn, currentRoles } = rootStore.userStore;

    // check if route is restricted by role
    const found = roles.some(r => currentRoles.includes(r))
    if (!found) {
        // role not authorised so redirect to home page
        return <Redirect to={{ pathname: '/questions' }} />
    }
    return (
        <Route
            {...rest}
            render={(props) => isLoggedIn ? <Component {...props} /> : <Redirect to='/' />}
        />
    )
}

export default observer(PrivateRoute)
