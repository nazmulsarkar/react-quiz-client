import React from 'react';
import { List, Image, Popup } from 'semantic-ui-react';
import { IAnswerBy } from '../../../app/models/question';

interface IProps {
  attendees: IAnswerBy[];
}

const styles = {
  borderColor: 'orange',
  borderWidth: 2
}

const QuestionListItemAttendees: React.FC<IProps> = ({ attendees }) => {
  return (
    <List horizontal>
      {attendees.map(attendee => (
        <List.Item key={attendee.id}>
          <Popup
            header={attendee.displayName}
            trigger={
              <Image
                size='mini'
                circular
                src={'/assets/user.png'}
                bordered
                style={styles}
              />
            }
          />
        </List.Item>
      ))}
    </List>
  );
};

export default QuestionListItemAttendees;
