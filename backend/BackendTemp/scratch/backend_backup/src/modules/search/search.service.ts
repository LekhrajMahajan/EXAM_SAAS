import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import searchRepository from "./search.repository";
import { ISearchRequest, SearchEntity } from "./search.types";

class SearchService {
  async globalSearch(payload: ISearchRequest) {
    return searchRepository.globalSearch(payload);
  }

  async searchByEntity(entity: SearchEntity, payload: ISearchRequest) {
    switch (entity) {
      case SearchEntity.CANDIDATE:
        return searchRepository.searchCandidates(payload);
      case SearchEntity.EMPLOYEE:
        return searchRepository.searchEmployees(payload);
      case SearchEntity.COMPANY:
        return searchRepository.searchCompanies(payload);
      case SearchEntity.BRANCH:
        return searchRepository.searchCenters(payload);
      case SearchEntity.CENTER:
        return searchRepository.searchCenters(payload);
      case SearchEntity.SUBJECT:
        return searchRepository.searchSubjects(payload);
      case SearchEntity.CHAPTER:
        return searchRepository.searchChapters(payload);
      case SearchEntity.TOPIC:
        return searchRepository.searchTopics(payload);
      case SearchEntity.QUESTION:
        return searchRepository.searchQuestions(payload);
      case SearchEntity.PAPER:
        return searchRepository.searchPapers(payload);
      case SearchEntity.EXAM:
        return searchRepository.searchExams(payload);
      case SearchEntity.RESULT:
        return searchRepository.searchResults(payload);
      case SearchEntity.CERTIFICATE:
        return searchRepository.searchCertificates(payload);
      default:
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Unsupported search entity: ${entity}`);
    }
  }

  async getSuggestions(payload: ISearchRequest) {
    return searchRepository.getSuggestions(payload);
  }
}

export default new SearchService();
