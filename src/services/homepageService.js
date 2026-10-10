import { contentService } from './contentService.js';

export const homepageService = {
  getPublishedContent: () => contentService.getPublishedContent(),
  getDraftContent: () => contentService.getDraftContent(),
  saveDraft: (content) => contentService.saveDraft(content),
  publishContent: (content) => contentService.publishContent(content)
};
