import { IAnswer } from "../../models/answer";
import { IAnswerBy, IQuestion } from "../../models/question";
import { IUser } from "../../models/user";

export const combineDateAndTime = (date: Date, time: Date) => {
  // const timeString = time.getHours() + ':' + time.getMinutes() + ':00';

  // const year = date.getFullYear();
  // const month = date.getMonth() + 1;
  // const day = date.getDate();
  // const dateString = `${year}-${month}-${day}`;

  const dateString = date.toISOString().split('T')[0];
  const timeString = time.toISOString().split('T')[1];

  return new Date(dateString + 'T' + timeString);
}

export const setQuestionProps = (question: IQuestion) => {
  return question;
}

export const setAnswerProps = (answer: IAnswer) => {
  answer.createdAt = new Date(answer.createdAt);
  return answer;
}

export const createAttendee = (user: IUser): IAnswerBy => {
  return {
    _id: user._id,
    email: user.email,
    displayName: user.displayName,
    username: user.username
  }
}