import React, { Fragment } from 'react';
import { Segment, List, Item, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IAnswerBy } from '../../../app/models/question';
import { observer } from 'mobx-react-lite';

interface IProps {
  attendees: IAnswerBy[];
}

const QuestionDetailedSidebar: React.FC<IProps> = ({ attendees }) => {
  return (
    <Fragment>
      <Segment
        textAlign='center'
        style={{ border: 'none' }}
        attached='top'
        secondary
        inverted
        color='teal'
      >
        {attendees.length} {attendees.length === 1 ? 'Person' : 'People'} going
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {attendees.map(attendee => (
            <Item key={attendee.username} style={{ position: 'relative' }}>
              <Image size='tiny' src={'/assets/user.png'} />
              <Item.Content verticalAlign='middle'>
                <Item.Header as='h3'>
                  <Link to={'#'}>
                    {attendee.displayName}
                  </Link>
                </Item.Header>
              </Item.Content>
            </Item>
          ))}
        </List>
      </Segment>
    </Fragment>
  );
};

export default observer(QuestionDetailedSidebar);
