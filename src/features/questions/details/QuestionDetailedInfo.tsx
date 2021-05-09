import React from 'react';
import { Segment, Grid, Icon } from 'semantic-ui-react';
import { IQuestion } from '../../../app/models/question';
import { format } from 'date-fns';

const QuestionDetailedInfo: React.FC<{ question: IQuestion }> = ({ question }) => {
  return (
    <Segment.Group>
      <Segment attached='top'>
        <Grid>
          <Grid.Column width={1}>
            <Icon size='large' color='teal' name='info' />
          </Grid.Column>
          <Grid.Column width={15}>
            <p>{question.description}</p>
          </Grid.Column>
        </Grid>
      </Segment>
      <Segment attached>
        <Grid verticalAlign='middle'>
          <Grid.Column width={1}>
            <Icon name='calendar' size='large' color='teal' />
          </Grid.Column>
          <Grid.Column width={15}>
            <span>{format(question.date, 'eeee do MMMM')} at {format(question.date!, 'h:mm a')}</span>
          </Grid.Column>
        </Grid>
      </Segment>
    </Segment.Group>
  );
};

export default QuestionDetailedInfo;
