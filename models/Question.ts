import { questionCollection } from "../mongo.ts";
import Base from "./Base.ts";

export default class Question extends Base {
  public id: string = "";

  constructor(
    public surveyId: string,
    public text: string,
    public type: QuestionType,
    public required: boolean,
    public data: any
  ) {
    super();
  }

  async createQuestion() {
    delete this.id;
    const { $oid } = await questionCollection.insertOne(this);
    this.id = $oid;
    return this;
  }

  static async findBySurvey(surveyId: string): Promise<Question[]> {
    const questions = await questionCollection.find({ surveyId: surveyId });
    return questions.map((question: any) => Question.prepare(question));
  }

  static async findById(id: string) {
    const question = await questionCollection.findOne({ _id: { $oid: id } });
    if (!question) {
      return null;
    }
    return Question.prepare(question);
  }

  protected static prepare(data: any): Question {
    data = Base.prepare(data);
    const question = new Question(
      data.surveyId,
      data.text,
      data.type,
      data.required,
      data.data
    );
    question.id = data.id;
    return question;
  }
}

export enum QuestionType {
  CHOICE = "choice",
  TEXT = "text",
}
