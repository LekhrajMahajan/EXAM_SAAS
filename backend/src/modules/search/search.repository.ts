import Candidate from "../candidate/candidate.model";
import Employee from "../employee/employee.model";
import Company from "../company/company.model";
import Center from "../center/center.model";
import Subject from "../subject/subject.model";
import Chapter from "../chapter/chapter.model";
import Topic from "../topic/topic.model";
import Question from "../question-bank/question.model";
import Paper from "../paper/paper.model";
import Exam from "../exam/exam.model";
import Result from "../result/result.model";
import Certificate from "../certificate/certificate.model";

import { BaseRepository } from "../../common/base.repository";
import { ISearchRequest } from "./search.types";

class SearchRepository extends BaseRepository<any> {
  constructor() {
    super(null as any); // Search module is a specialized aggregator, no single model applies.
  }
  /*
    |--------------------------------------------------------------------------
    | Candidate Search
    |--------------------------------------------------------------------------
    */

  async searchCandidates(payload: ISearchRequest) {
    return Candidate.find({
      $text: {
        $search: payload.keyword,
      },
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Employee Search
    |--------------------------------------------------------------------------
    */

  async searchEmployees(payload: ISearchRequest) {
    return Employee.find({
      $text: {
        $search: payload.keyword,
      },
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Company Search
    |--------------------------------------------------------------------------
    */

  async searchCompanies(payload: ISearchRequest) {
    return Company.find({
      $text: {
        $search: payload.keyword,
      },
    });
  }


  /*
    |--------------------------------------------------------------------------
    | Center Search
    |--------------------------------------------------------------------------
    */

  async searchCenters(payload: ISearchRequest) {
    return Center.find({
      $text: {
        $search: payload.keyword,
      },
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Subject Search
    |--------------------------------------------------------------------------
    */

  async searchSubjects(payload: ISearchRequest) {
    return Subject.find({
      $text: {
        $search: payload.keyword,
      },
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Chapter Search
    |--------------------------------------------------------------------------
    */

  async searchChapters(payload: ISearchRequest) {
    return Chapter.find({
      $text: {
        $search: payload.keyword,
      },
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Topic Search
    |--------------------------------------------------------------------------
    */

  async searchTopics(payload: ISearchRequest) {
    return Topic.find({
      $text: {
        $search: payload.keyword,
      },
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Question Search
    |--------------------------------------------------------------------------
    */

  async searchQuestions(payload: ISearchRequest) {
    return Question.find({
      $text: {
        $search: payload.keyword,
      },
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Paper Search
    |--------------------------------------------------------------------------
    */

  async searchPapers(payload: ISearchRequest) {
    return Paper.find({
      $text: {
        $search: payload.keyword,
      },
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Exam Search
    |--------------------------------------------------------------------------
    */

  async searchExams(payload: ISearchRequest) {
    return Exam.find({
      $text: {
        $search: payload.keyword,
      },
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Result Search
    |--------------------------------------------------------------------------
    */

  async searchResults(payload: ISearchRequest) {
    return Result.find({
      $text: {
        $search: payload.keyword,
      },
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Certificate Search
    |--------------------------------------------------------------------------
    */

  async searchCertificates(payload: ISearchRequest) {
    return Certificate.find({
      $text: {
        $search: payload.keyword,
      },
    });
  }

  /*
    |--------------------------------------------------------------------------
    | Global Search
    |--------------------------------------------------------------------------
    */

  async globalSearch(payload: ISearchRequest) {
    const [
      candidates,

      employees,

      companies,

      centers,

      subjects,

      chapters,

      topics,

      questions,

      papers,

      exams,

      results,

      certificates,
    ] = await Promise.all([
      this.searchCandidates(payload),

      this.searchEmployees(payload),

      this.searchCompanies(payload),

      this.searchCenters(payload),

      this.searchSubjects(payload),

      this.searchChapters(payload),

      this.searchTopics(payload),

      this.searchQuestions(payload),

      this.searchPapers(payload),

      this.searchExams(payload),

      this.searchResults(payload),

      this.searchCertificates(payload),
    ]);

    return {
      candidates,

      employees,

      companies,

      centers,

      subjects,

      chapters,

      topics,

      questions,

      papers,

      exams,

      results,

      certificates,
    };
  }

  /*
    |--------------------------------------------------------------------------
    | Search Suggestions
    |--------------------------------------------------------------------------
    */

  async getSuggestions(payload: ISearchRequest) {
    return Candidate.find({
      $text: {
        $search: payload.keyword,
      },
    })

      .limit(10)

      .select("fullName");
  }
}

export default new SearchRepository();
