import React, { useContext } from 'react';
import { Segment, Item, Header, Button, Image } from 'semantic-ui-react';
import { IAnswer } from '../../../app/models/answer';
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';
import { RootStoreContext } from '../../../app/stores/rootStore';

const answerImageStyle = {
  filter: 'brightness(30%)'
};

const answerImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};

const AnswerDetailedHeader: React.FC<{ answer: IAnswer }> = ({
  answer
}) => {
  const rootStore = useContext(RootStoreContext);
  return (
    <Segment.Group>
      <Segment basic attached='top' style={{ padding: '0' }}>
        <Image
          src={`/assets/categoryImages/answer.jpg`}
          fluid
          style={answerImageStyle}
        />
        <Segment style={answerImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size='huge'
                  content={answer.title}
                  style={{ color: 'white' }}
                />
                <p>{format(answer.createdAt, 'eeee do MMMM')}</p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
    </Segment.Group>
  );
};

export default observer(AnswerDetailedHeader);
