import { z } from 'zod';
import {
  paperBasicInfoSchema,
  paperQuestionSchema,
  paperBlueprintSchema,
  paperSchema,
} from '../schemas/paper-schemas';

export type PaperBasicInfo = z.infer<typeof paperBasicInfoSchema>;
export type PaperQuestion = z.infer<typeof paperQuestionSchema>;
export type PaperBlueprint = z.infer<typeof paperBlueprintSchema>;
export type Paper = z.infer<typeof paperSchema>;
