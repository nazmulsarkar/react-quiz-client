import React, { useContext } from 'react';
import { Segment, Item, Header, Button, Image } from 'semantic-ui-react';
import { IQuestion } from '../../../app/models/question';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { format } from 'date-fns';
import { Role } from '../../../app/common/helpers/role';
import { Link } from 'react-router-dom';

const questionImageStyle = {
  filter: 'brightness(30%)'
};

const questionImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};

const QuestionDetailedHeader: React.FC<{ question: IQuestion }> = ({
  question
}) => {
  const rootStore = useContext(RootStoreContext);
  const { user } = rootStore.userStore;

  return (
    <Segment.Group>
      <Segment basic attached='top' style={{ padding: '0' }}>
        <Image
          src={`/assets/categoryImages/question.jpg`}
          fluid
          style={questionImageStyle}
        />
        <Segment style={questionImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size='huge'
                  content={question.title}
                  style={{ color: 'white' }}
                />
                <p>{format(new Date(question.createdAt), 'eeee do MMMM')}</p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached='bottom'>
        {user && user.roles && user.roles.includes(Role.User) && (
          // <Menu.Item>
          <Button
            as={Link}
            to={`/createAnswer/${question._id}`}
            content='Answer this Question'
            color='teal'
          />
        )}
      </Segment>
    </Segment.Group>
  );
};

export default observer(QuestionDetailedHeader);
