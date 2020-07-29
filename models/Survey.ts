import { surveyCollection } from "../mongo.ts";
import Base from "./Base.ts";

export default class Survey extends Base {
  public id: string = "";

  constructor(
    public name: string,
    public description: string,
    public userId: string
  ) {
    super();
  }

  async createSurvey() {
    delete this.id;
    const { $oid } = await surveyCollection.insertOne(this);
    this.id = $oid;
    return this;
  }

  async updateSurvey({
    name,
    description,
  }: {
    name: string;
    description: string;
  }) {
    const survey = await surveyCollection.updateOne(
      { _id: { $oid: this.id } },
      { $set: { name, description } }
    );
    console.log(survey);
    this.name = name;
    this.description = description;
    return this;
  }

  deleteSurvey() {
    return surveyCollection.deleteOne({ _id: { $oid: this.id } });
  }

  static async findByUser(userId: string): Promise<Survey[]> {
    const surveys = await surveyCollection.find({ userId });
    return surveys.map((survey: any) => Survey.prepare(survey));
  }

  static async findById(id: string) {
    const survey = await surveyCollection.findOne({
      _id: { $oid: id },
    });
    if (!survey) {
      return null;
    }
    return Survey.prepare(survey);
  }

  static async findAll(): Promise<Survey[]> {
    const surveys = await surveyCollection.find();
    return surveys.map((survey: any) => Survey.prepare(survey));
  }

  protected static prepare(data: any): Survey {
    data = Base.prepare(data);
    const survey = new Survey(data.name, data.description, data.userId);
    survey.id = data.id;
    return survey;
  }
}
