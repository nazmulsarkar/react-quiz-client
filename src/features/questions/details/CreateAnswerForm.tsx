
import React, { useState, useContext, useEffect } from 'react';
import { Segment, Form, Button, Grid } from 'semantic-ui-react';
import { QuestionFormValues } from '../../../app/models/question';
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router';
import { Form as FinalForm, Field } from 'react-final-form';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import {
  combineValidators,
  isRequired,
  composeValidators,
  hasLengthGreaterThan
} from 'revalidate';
import { RootStoreContext } from '../../../app/stores/rootStore';
import SelectInput from '../../../app/common/form/SelectInput';
import { AnswerFormValues } from '../../../app/models/answer';
import TextInput from '../../../app/common/form/TextInput';

const validate = combineValidators({
  title: isRequired({ message: 'The event title is required' }),
  description: composeValidators(
    isRequired('Title'),
    isRequired('Description'),
    isRequired('Question'),
    hasLengthGreaterThan(4)({
      message: 'Description needs to be at least 5 characters'
    })
  )()
});

interface DetailParams {
  id: string;
}

const CreateAnswerForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    questionsByDate,
    loadQuestion
  } = rootStore.questionStore;

  const {
    createAnswer,
    submitting,
  } = rootStore.answerStore;

  const [question, setQuestion] = useState(new QuestionFormValues());
  const [answer] = useState(new AnswerFormValues());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadQuestion(match.params.id)
        .then(question => {
          setQuestion(new QuestionFormValues(question));
        })
        .finally(() => setLoading(false));
    }
  }, [loadQuestion, match.params.id]);

  const handleFinalFormSubmit = (values: any) => {
    const { date, time, ...answer } = values;
    if (!answer._id) {
      let newAnswer = {
        ...answer,
        _id: uuid()
      };
      createAnswer(newAnswer);
    }
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            validate={validate}
            initialValues={answer}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name='title'
                  placeholder='Title'
                  value={question.title}
                  component={TextInput}
                />
                <Field
                  component={SelectInput}
                  options={questionsByDate}
                  name='questionId'
                  placeholder='Question'
                  value={question._id}
                />
                <Field
                  name='description'
                  placeholder='Description'
                  rows={3}
                  value={answer.description}
                  component={TextAreaInput}
                />

                <Button
                  loading={submitting}
                  disabled={loading || invalid || pristine}
                  floated='right'
                  positive
                  type='submit'
                  content='Submit'
                />
                <Button
                  onClick={
                    question._id
                      ? () => history.push(`/questions/${question._id}`)
                      : () => history.push('/questions')
                  }
                  disabled={loading}
                  floated='right'
                  type='button'
                  content='Cancel'
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(CreateAnswerForm);
