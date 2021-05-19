import React from 'react';
import { Item, Button, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IAnswer } from '../../../app/models/answer';

const AnswerListItem: React.FC<{ answer: IAnswer }> = ({ answer }) => {
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Content>
              <Item.Header as={Link} to={`/answers/${answer._id}`}>
                {answer.title}
              </Item.Header>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment secondary>
        <Item>
          <Item.Content>{answer.answerBy.displayName}</Item.Content>
        </Item>
      </Segment>
      <Segment clearing>
        <span>{answer.description}</span>
        <Button
          as={Link}
          to={`/answers/${answer._id}`}
          floated='right'
          content='View'
          color='blue'
        />
      </Segment>
    </Segment.Group>
  );
};

export default AnswerListItem;
