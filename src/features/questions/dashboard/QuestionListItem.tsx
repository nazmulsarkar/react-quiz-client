import React from 'react';
import { Item, Button, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IQuestion } from '../../../app/models/question';

const QuestionListItem: React.FC<{ question: IQuestion }> = ({ question }) => {
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Content>
              <Item.Header as={Link} to={`/questions/${question._id}`}>
                {question.title}
              </Item.Header>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment clearing>
        <span>{question.description}</span>
        <Button
          as={Link}
          to={`/questions/${question._id}`}
          floated='right'
          content='View'
          color='blue'
        />
      </Segment>
    </Segment.Group>
  );
};

export default QuestionListItem;
