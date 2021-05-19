import React, { useContext } from 'react';
import { Segment, Item, Header, Button, Image } from 'semantic-ui-react';
import { IQuestion } from '../../../app/models/question';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { format } from 'date-fns';

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
  const { attendQuestion, loading } = rootStore.questionStore;
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
        {(
          <Button loading={loading} onClick={attendQuestion} color='teal'>
            Join Question
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
};

export default observer(QuestionDetailedHeader);
