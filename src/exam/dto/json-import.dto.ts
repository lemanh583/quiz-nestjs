
class AnswerJSONSchemaDto {
    title: string;
    correct: boolean;
}

class QuestionJSONSchemaDto {
    title: string;
    recommend: string;
    answers: AnswerJSONSchemaDto[]
}

class ExamJSONSchemaDto {
    title: string;
    lang: string;
    questions: QuestionJSONSchemaDto []
}

export class JSONImportDto {
    title: string;
    exams: ExamJSONSchemaDto[]
    lang: string
    created_at: number
    updated_at: number
}
