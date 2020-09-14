import {questionCollection } from '../mongo.ts';
import { BaseModel } from './BaseModel.ts';

export class Question extends BaseModel{
    public id: string = "";
    constructor(
        public surveyId : string,
        public text : string,
        public type : QuestionType,
        public required : boolean,
        public data: any
    ){
        super();
    }

    static async getQuestionsBySurvey(surveyId : string) : Promise<Question[]> {
        const questions = await questionCollection.find( { surveyId } );
        if(!questions){
            return [];
        }

        return questions.map( (question : Object) => {
            // console.log(question);
            return Question.prepare(question);
        } );
    }

    static async getSingleQuestion(questionId: string) : Promise<Question | null> {
        const question = await questionCollection.findOne({_id : { $oid : questionId}});
        if(!question){
            return null;
        }
        else{
            return Question.prepare(question);
        }
    }

    async createQuestion(){
        delete this.id;
        const question = await questionCollection.insertOne(this);
        this.id =  question.$oid;
        return this;
    }

    static async updateQuestionStaticOne(id: string, surveyId : string, text: string, type:QuestionType, required : boolean, data:any){
        const  { modifiedCount } = await questionCollection.updateOne(
            { _id : { $oid : id } },
            {
            $set  : { 
                text : text,
                type : type,
                required : required,
                data: data
             }
            }
            );
    }
    async updateQuestion(text: string, type:QuestionType, required : boolean, data:any){
            const  { modifiedCount } = await questionCollection.updateOne(
                { _id : { $oid : this.id } },
                {
                $set  : { 
                        text : text,
                        type : type,
                        required : required,
                        data: data
                     }
                 }
                );

        if(modifiedCount > 0){
            this.text = text;
            this.type = type;
            this.required = required;
            this.data = data;
        }
        return this;
    }

    static async deleteQuestion(id: string){
        return await questionCollection.deleteOne( {  _id : { $oid : id }});
    }

    static prepare(data:any): Question{
        data = BaseModel.prepare(data);
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

    isText(){
        return this.type === QuestionType.TEXT;
        
    }

    isChoice(){
        return this.type == QuestionType.CHOICE;
           
    }


}

export enum QuestionType {
    TEXT = "text",
    CHOICE = "choice"
}