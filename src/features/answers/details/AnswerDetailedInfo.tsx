import React from 'react';
import { Segment, Grid, Icon } from 'semantic-ui-react';
import { IAnswer } from '../../../app/models/answer';
import { format } from 'date-fns';

const AnswerDetailedInfo: React.FC<{ answer: IAnswer }> = ({ answer }) => {
  return (
    <Segment.Group>
      <Segment attached='top'>
        <Grid>
          <Grid.Column width={1}>
            <Icon size='large' color='teal' name='info' />
          </Grid.Column>
          <Grid.Column width={15}>
            <p>{answer.description}</p>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign='middle'>
          <Grid.Column width={1}>
            <Icon name='calendar' size='large' color='teal' />
          </Grid.Column>
          <Grid.Column width={15}>
            <span>{format(answer.createdAt, 'eeee do MMMM')} at {format(answer.createdAt!, 'h:mm a')}</span>
          </Grid.Column>
        </Grid>
      </Segment>
    </Segment.Group>
  );
};

export default AnswerDetailedInfo;
